const http = require('http');
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

function loadEnvFile(filePath = path.join(__dirname, '.env')) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key] !== undefined) return;

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

loadEnvFile();

function hasConfiguredEnv(name) {
  const value = process.env[name];
  return Boolean(value && value.trim() && !/^your_/i.test(value.trim()));
}

const port = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, 'public');
const GOLD_API_BASE_URL = 'https://www.goldapi.io/api';
const GOLD_API_SYMBOL = process.env.GOLD_API_SYMBOL || 'XAU';
const GOLD_API_CURRENCY = process.env.GOLD_API_CURRENCY || 'USD';
const GOLD_API_DATE = process.env.GOLD_API_DATE || '';
const METALS_DEV_API_BASE_URL = 'https://api.metals.dev/v1';
const YAHOO_FINANCE_CHART_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';
const YAHOO_GOLD_SYMBOL = 'GC=F';
const YAHOO_SILVER_SYMBOL = 'SI=F';
const YAHOO_USD_KRW_SYMBOL = 'KRW=X';
const YAHOO_TREASURY_10Y_SYMBOL = '^TNX';
const YAHOO_DXY_SYMBOL = 'DX-Y.NYB';
const YAHOO_WTI_SYMBOL = 'CL=F';
const YAHOO_GLD_SYMBOL = 'GLD';
const KRX_GOLD_API_URL = 'https://apis.data.go.kr/1160100/service/GetGeneralProductInfoService/getGoldPriceInfo';
const KOREA_GOLDX_CHART_URL = 'https://www.koreagoldx.co.kr/api/main/chart';
const TROY_OUNCE_GRAMS = 31.1034768;
const DON_GRAMS = 3.75;
const FRED_API_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything';
const GNEWS_API_BASE_URL = 'https://gnews.io/api/v4/search';
const GDELT_API_BASE_URL = 'https://api.gdeltproject.org/api/v2/doc/doc';
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';
const MYMEMORY_TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';
const NEWS_QUERY = process.env.NEWS_QUERY || '(gold OR bullion OR "Federal Reserve" OR FOMC OR Powell OR "Kevin Warsh" OR "interest rates" OR "rate cut" OR PCE OR CPI OR inflation OR "Treasury yields" OR "US dollar" OR "dollar index" OR DXY OR Trump OR tariff OR sanctions OR Iran OR Israel OR Gaza OR "Middle East")';
const NEWS_PAGE_SIZE = Number(process.env.NEWS_PAGE_SIZE || 10);
const NEWS_MIN_SCORE = Number(process.env.NEWS_MIN_SCORE || 60);
const NEWS_FETCH_TIMEOUT_MS = Number(process.env.NEWS_FETCH_TIMEOUT_MS || 7000);
const newsTranslationCache = new Map();
const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
const defaultOfficialNewsFeeds = [
  { name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_monetary.xml' },
  { name: 'Federal Reserve Speeches', url: 'https://www.federalreserve.gov/feeds/speeches.xml' },
];
const googleNewsTopics = [
  'gold price OR bullion when:1d',
  'central bank gold purchase OR gold reserves when:1d',
  'Japan interest rate gold OR Bank of Japan gold when:1d',
  'India gold import OR India gold duty when:1d',
  'tariff sanctions gold price when:1d',
];
const newsStreamClients = new Set();
let latestNewsSnapshot = null;
let latestNewsSnapshotAt = 0;

const fallbackIndicators = {
  daily: [
    {
      name: '미국 10년물 실질금리',
      value: '2.12%',
      compare: '전일 2.03%',
      change: '+0.09%p',
      impact: 'down',
      summary: '실질금리가 상승하면 금을 보유하는 기회비용이 커져 단기적으로 금값에 부담이 될 수 있습니다.',
      related: '10년물 국채금리, 기대인플레이션, 달러지수',
    },
    {
      name: '미국 10년물 국채금리',
      value: '4.37%',
      compare: '전일 4.29%',
      change: '+0.08%p',
      impact: 'down',
      summary: '명목금리 상승은 이자를 주지 않는 금의 상대 매력을 낮출 수 있습니다.',
      related: '실질금리, FOMC, 달러지수',
    },
    {
      name: '미국 GDP 대비 부채 비율',
      value: '120.4%',
      compare: '이전 119.8%',
      change: '+0.60%p',
      impact: 'up',
      summary: 'GDP 대비 부채 비율 상승은 미국 재정 건전성 우려와 장기 안전자산 수요를 자극할 수 있습니다.',
      related: '미국 국채금리, 달러지수, 재정적자',
    },
    {
      name: '달러지수 DXY',
      value: '105.18',
      compare: '전일 104.72',
      change: '+0.44%',
      impact: 'down',
      summary: '달러 강세는 달러 외 통화권 투자자에게 금 가격 부담을 키울 수 있습니다.',
      related: '미국 국채금리, 원/달러 환율',
    },
    {
      name: '원/달러 환율',
      value: '1,372.4원',
      compare: '전일 1,365.8원',
      change: '+0.48%',
      impact: 'neutral',
      summary: '원화 약세는 국내 투자자의 금 원화 가격을 밀어 올릴 수 있습니다.',
      related: 'DXY, 국내 금 가격',
    },
    {
      name: '유가',
      value: '$78.60',
      compare: 'WTI 전일 $77.90',
      change: '+0.90%',
      impact: 'up',
      summary: '유가 상승은 인플레이션 기대를 자극해 금의 물가 방어 수요를 높일 수 있습니다.',
      related: 'CPI, PCE, 기대인플레이션',
    },
    {
      name: 'GLD ETF 가격',
      value: '$215.40',
      compare: '전일 $213.80',
      change: '+0.75%',
      impact: 'up',
      summary: 'GLD는 대표적인 금 현물 ETF라서 가격 상승은 금 투자 수요와 국제 금값 흐름을 함께 확인하는 참고 지표가 될 수 있습니다.',
      related: '국제 금값, ETF 투자 수요, 달러지수',
    },
  ],
  monthly: [
    {
      name: 'PCE',
      value: '2.8%',
      compare: '이전 2.7%',
      change: '예상 상회',
      impact: 'down',
      summary: '연준이 선호하는 물가 지표가 예상보다 높으면 금리 인하 기대가 약해질 수 있습니다.',
      related: 'FOMC, 실질금리, 달러지수',
    },
    {
      name: '근원 PCE',
      value: '2.8%',
      compare: '이전 2.8%',
      change: '높은 기저 유지',
      impact: 'down',
      summary: '식품과 에너지를 제외한 근원 PCE가 높으면 연준의 물가 경계가 이어질 수 있습니다.',
      related: 'PCE, FOMC, 실질금리',
    },
    {
      name: 'CPI',
      value: '3.4%',
      compare: '이전 3.2%',
      change: '예상 상회',
      impact: 'down',
      summary: 'CPI가 예상보다 높으면 국채금리와 달러가 상승해 금값에 부담이 될 수 있습니다.',
      related: 'PCE, 국채금리, FedWatch',
    },
    {
      name: '근원 CPI',
      value: '3.6%',
      compare: '이전 3.5%',
      change: '근원 물가 압력',
      impact: 'down',
      summary: '근원 CPI는 서비스 물가와 임금 압력을 반영해 금리 전망에 영향을 줄 수 있습니다.',
      related: 'CPI, 임금, 서비스 물가',
    },
    {
      name: '고용보고서',
      value: '+175K',
      compare: '이전 +190K',
      change: '고용 둔화',
      impact: 'up',
      summary: '고용 둔화는 금리 인하 기대와 안전자산 선호를 높일 수 있습니다.',
      related: '평균 시간당 임금, 실업률',
    },
    {
      name: '실업률',
      value: '3.9%',
      compare: '이전 3.8%',
      change: '실업률 상승',
      impact: 'up',
      summary: '실업률 상승은 경기 둔화와 금리 인하 기대를 키워 금값에 우호적일 수 있습니다.',
      related: '고용보고서, 임금, 경기',
    },
    {
      name: '임금',
      value: '+0.3%',
      compare: '이전 +0.4%',
      change: '임금 둔화',
      impact: 'up',
      summary: '임금 상승세 둔화는 물가 압력을 낮춰 금리 인하 기대에 우호적일 수 있습니다.',
      related: '고용보고서, CPI, PCE',
    },
    {
      name: '소매판매',
      value: '+0.1%',
      compare: '예상 +0.3% / 이전 +0.6%',
      change: '예상 하회',
      impact: 'up',
      summary: '소비 둔화는 경기 냉각 신호로 해석되어 금 수요에 우호적일 수 있습니다.',
      related: 'GDP, 소비자심리',
    },
    {
      name: 'GDP',
      value: '1.6%',
      compare: '예상 2.4% / 이전 3.4%',
      change: '성장 둔화',
      impact: 'up',
      summary: '성장률 둔화는 경기 우려와 금리 인하 기대를 동시에 키울 수 있습니다.',
      related: '소비, 투자, 무역',
    },
    {
      name: '중앙은행 금 매입',
      value: '월 +38t',
      compare: '이전 +25t',
      change: '매입 확대',
      impact: 'up',
      summary: '중앙은행 매입 확대는 금의 장기 수요를 지지하는 구조적 요인입니다.',
      related: '중국, 인도, 튀르키예',
    },
  ],
};

const fallbackGoldPrice = {
  symbol: 'XAU/USD',
  name: '국제 금값',
  price: 2342.8,
  change: -9.84,
  changePercent: -0.42,
  bid: 2342.2,
  ask: 2343.1,
  open: 2352.7,
  high: 2361.4,
  low: 2338.2,
  previousClose: 2352.64,
  gram24k: 75.32,
  unit: '트로이온스',
  currency: 'USD',
  source: 'sample',
  updatedAt: new Date().toISOString(),
  isFallback: true,
};

const newsFeed = [
  {
    id: 'fed-rate-cuts-001',
    titleKo: 'Fed 인사, 금리 인하 신중론 언급',
    titleOriginal: 'Fed official signals caution on rate cuts',
    source: 'Example US News',
    publishedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    url: 'https://example.com/fed-rate-cuts',
    tags: ['금리', '달러', '국채금리'],
    priority: '속보',
    impactScore: 92,
    relatedAssets: ['국제 금', 'DXY', '10년물 금리'],
    highlights: ['금리 인하 기대 약화', '달러 강세 가능성', '단기 금값 부담'],
    summaryKo: '연준 인사의 신중한 발언으로 금리 인하 기대가 낮아지며 달러와 국채금리가 상승할 가능성이 있습니다.',
    clusterKey: 'fed-rate-cut-caution',
    duplicateCount: 3,
  },
  {
    id: 'dollar-yields-001',
    titleKo: '달러지수 상승, 금 현물 가격 압박',
    titleOriginal: 'Dollar climbs as Treasury yields rise',
    source: 'Market Wire',
    publishedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    url: 'https://example.com/dollar-gold',
    tags: ['달러', '미국 국채금리'],
    priority: '중요',
    impactScore: 84,
    relatedAssets: ['국제 금', '국내 금', '원/달러'],
    highlights: ['달러 강세', '국채금리 상승', '금 현물 압박'],
    summaryKo: '달러 강세와 국채금리 상승이 동시에 나타나며 금 현물 가격에 단기 하락 압력이 커졌습니다.',
    clusterKey: 'dollar-yields-gold-pressure',
    duplicateCount: 2,
  },
  {
    id: 'central-bank-gold-001',
    titleKo: '중앙은행 금 매입, 3개월 연속 확대',
    titleOriginal: 'Central banks extend gold buying streak',
    source: 'Global Finance Daily',
    publishedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    url: 'https://example.com/central-bank-gold',
    tags: ['중앙은행 금 매입'],
    priority: '중요',
    impactScore: 78,
    relatedAssets: ['국제 금', '금 ETF'],
    highlights: ['중앙은행 매입 확대', '장기 수요 지지', '하방 완충 요인'],
    summaryKo: '신흥국 중앙은행 중심의 금 매입 확대는 장기 수요를 지지하는 요인으로 해석됩니다.',
    clusterKey: 'central-bank-gold-buying',
    duplicateCount: 1,
  },
  {
    id: 'oil-inflation-001',
    titleKo: '유가 반등, 인플레이션 경로 재부각',
    titleOriginal: 'Oil rebound puts inflation path back in focus',
    source: 'Energy Desk',
    publishedAt: new Date(Date.now() - 72 * 60 * 1000).toISOString(),
    url: 'https://example.com/oil-inflation',
    tags: ['유가', '인플레이션'],
    priority: '일반',
    impactScore: 63,
    relatedAssets: ['WTI', 'CPI', '국제 금'],
    highlights: ['유가 상승', '물가 경로 재부각', '연준 경계감'],
    summaryKo: '유가 상승은 향후 물가 지표와 기대인플레이션에 영향을 줄 수 있어 금 시장도 주시하고 있습니다.',
    clusterKey: 'oil-inflation-watch',
    duplicateCount: 1,
  },
];

const newsSignals = [
  {
    pattern: /\bfed\b|federal reserve|fomc|powell|fed chair|federal open market committee/i,
    tag: '금리',
    asset: '미국 국채금리',
    highlight: 'FOMC·연준 정책 관련',
    score: 28,
  },
  {
    pattern: /kevin warsh|warsh/i,
    tag: '연준 인사',
    asset: '금리 전망',
    highlight: '케빈 워시·연준 인선 관련',
    score: 26,
  },
  {
    pattern: /interest rate|rate cut|rate hike|higher for longer|monetary policy|fed funds/i,
    tag: '금리',
    asset: '미국 국채금리',
    highlight: '금리 경로 관련',
    score: 26,
  },
  {
    pattern: /treasury|yield|bond/i,
    tag: '미국 국채금리',
    asset: '10년물 금리',
    highlight: '국채금리 변동 관련',
    score: 18,
  },
  {
    pattern: /u\.?s\.? dollar|us dollar|dollar index|greenback|dxy/i,
    tag: '달러',
    asset: 'DXY',
    highlight: '달러 강약 관련',
    score: 20,
  },
  {
    pattern: /inflation|consumer price|price index|prices/i,
    tag: '인플레이션',
    asset: 'CPI/PCE',
    highlight: '물가 지표 관련',
    score: 20,
  },
  {
    pattern: /\bpce\b|personal consumption expenditures/i,
    tag: 'PCE',
    asset: 'PCE',
    highlight: 'PCE 물가 지표 관련',
    score: 26,
  },
  {
    pattern: /\bcpi\b|consumer price index/i,
    tag: 'CPI',
    asset: 'CPI',
    highlight: 'CPI 물가 지표 관련',
    score: 24,
  },
  {
    pattern: /gold price|spot gold|gold futures|gold market|gold demand|bullion|\bxau\b|precious metal/i,
    tag: '금',
    asset: '국제 금',
    highlight: '금 시장 직접 관련',
    score: 22,
  },
  {
    pattern: /(trump|tariff|trade war|trade policy|import duty).*(tariff|federal reserve|powell|warsh|rate|dollar|inflation|iran|israel|middle east|sanction)|(tariff|federal reserve|powell|warsh|rate|dollar|inflation|iran|israel|middle east|sanction).*trump/i,
    tag: '트럼프·관세',
    asset: '달러/인플레이션',
    highlight: '트럼프 정책·관세 리스크 관련',
    score: 24,
  },
  {
    pattern: /geopolitical risk|safe haven|risk-off|war|conflict|sanction|ceasefire|missile|attack|invasion/i,
    tag: '지정학 리스크',
    asset: '안전자산 수요',
    highlight: '지정학·안전자산 수요 관련',
    score: 24,
  },
  {
    pattern: /(middle east|iran|israel|gaza|red sea|houthi|strait of hormuz).*(war|conflict|attack|ceasefire|sanction|oil|safe haven|geopolitical)|(war|conflict|attack|ceasefire|sanction|oil|safe haven|geopolitical).*(middle east|iran|israel|gaza|red sea|houthi|strait of hormuz)/i,
    tag: '중동 리스크',
    asset: '안전자산 수요',
    highlight: '중동 전쟁·긴장 관련',
    score: 28,
  },
  {
    pattern: /oil|crude|energy/i,
    tag: '유가',
    asset: 'WTI',
    highlight: '에너지 가격 관련',
    score: 10,
  },
  {
    pattern: /central bank|reserve bank|gold buying/i,
    tag: '중앙은행 금 매입',
    asset: '중앙은행 수요',
    highlight: '중앙은행 수요 관련',
    score: 16,
  },
];

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath);
  const type = contentTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500, {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      res.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }

    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

function sendJson(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(data));
}

function normalizeGoldApiResponse(data) {
  const symbol = `${GOLD_API_SYMBOL}/${GOLD_API_CURRENCY}`;
  return {
    symbol,
    name: '국제 금값',
    price: data.price,
    change: data.ch,
    changePercent: data.chp,
    bid: data.bid,
    ask: data.ask,
    open: data.open_price,
    high: data.high_price,
    low: data.low_price,
    previousClose: data.prev_close_price,
    gram24k: data.price_gram_24k,
    unit: '트로이온스',
    currency: data.currency || 'USD',
    source: data.exchange || 'GoldAPI.io',
    updatedAt: data.timestamp ? new Date(data.timestamp * 1000).toISOString() : new Date().toISOString(),
    isFallback: false,
  };
}

function normalizeYahooMetalResponse(result, config) {
  const meta = result.meta || {};
  const quotes = result.indicators?.quote?.[0] || {};
  const closes = (quotes.close || []).filter(Number.isFinite);
  const price = Number(meta.regularMarketPrice || closes[closes.length - 1]);
  const previousClose = Number(meta.chartPreviousClose || meta.previousClose || price);
  const change = price - previousClose;

  return {
    symbol: meta.symbol || config.symbol,
    name: config.name,
    price,
    change,
    changePercent: previousClose ? (change / previousClose) * 100 : 0,
    bid: meta.bid,
    ask: meta.ask,
    open: Number(meta.regularMarketOpen || quotes.open?.find(Number.isFinite) || previousClose),
    high: Number(meta.regularMarketDayHigh || Math.max(...(quotes.high || []).filter(Number.isFinite))),
    low: Number(meta.regularMarketDayLow || Math.min(...(quotes.low || []).filter(Number.isFinite))),
    previousClose,
    gramPriceUsd: config.isMetal ? price / TROY_OUNCE_GRAMS : null,
    gram24k: config.symbol === YAHOO_GOLD_SYMBOL ? price / TROY_OUNCE_GRAMS : null,
    unit: '트로이온스',
    currency: meta.currency || 'USD',
    source: `${meta.exchangeName || 'COMEX'} ${config.sourceLabel}`,
    updatedAt: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
    isFallback: false,
  };
}

function normalizeYahooGoldResponse(result) {
  return normalizeYahooMetalResponse(result, {
    symbol: YAHOO_GOLD_SYMBOL,
    name: '국제 금선물',
    sourceLabel: '금 선물',
    isMetal: true,
  });
}

function normalizeYahooSilverResponse(result) {
  return normalizeYahooMetalResponse(result, {
    symbol: YAHOO_SILVER_SYMBOL,
    name: '국제 은선물',
    sourceLabel: '은 선물',
    isMetal: true,
  });
}

const goldHistoryRanges = {
  day: { range: '1d', interval: '5m' },
  week: { range: '5d', interval: '30m' },
  month: { range: '1mo', interval: '1d' },
  year: { range: '1y', interval: '1wk' },
};

async function fetchYahooChart(symbol, range = 'day') {
  const config = goldHistoryRanges[range] || goldHistoryRanges.day;
  const params = new URLSearchParams({ range: config.range, interval: config.interval, includePrePost: 'false' });
  const response = await fetch(`${YAHOO_FINANCE_CHART_BASE_URL}/${encodeURIComponent(symbol)}?${params}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 GoldSignal/1.0' },
    signal: AbortSignal.timeout(7000),
  });
  if (!response.ok) throw new Error(`${symbol} chart API failed with ${response.status}`);
  const data = await response.json();
  const result = data.chart?.result?.[0];
  if (!result) throw new Error(data.chart?.error?.description || `${symbol} data is unavailable`);
  return result;
}

async function fetchYahooGoldChart(range = 'day') {
  return fetchYahooChart(YAHOO_GOLD_SYMBOL, range);
}

async function getGoldHistory(range = 'day') {
  const result = await fetchYahooGoldChart(range);
  return yahooHistoryFromResult(result, range, '금 선물');
}

function yahooHistoryFromResult(result, range, sourceLabel) {
  const closes = result.indicators?.quote?.[0]?.close || [];
  const history = (result.timestamp || []).map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toISOString(),
    value: Number(closes[index]),
  })).filter((point) => Number.isFinite(point.value) && point.value > 0);
  return {
    provider: `${result.meta?.exchangeName || 'COMEX'} ${sourceLabel}`,
    symbol: result.meta?.symbol,
    range,
    history,
  };
}

async function getSilverHistory(range = 'day') {
  try {
    return await getKoreaGoldxInternationalSilverHistory(range);
  } catch (error) {
    if (!hasConfiguredEnv('METALS_DEV_API_KEY')) throw error;
  }

  const start = rangeStartDate(range);
  const end = new Date();
  const chunks = [];
  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 30)) {
    const chunkEnd = new Date(Math.min(addDays(cursor, 29).getTime(), end.getTime()));
    chunks.push([cursor, chunkEnd]);
  }
  const responses = [];
  for (const [chunkStart, chunkEnd] of chunks) {
    responses.push(await fetchMetalsDev('timeseries', {
      start_date: isoDateOnly(chunkStart),
      end_date: isoDateOnly(chunkEnd),
    }));
  }
  const historyByDate = new Map();
  responses.flatMap(metalsDevSeriesPoints).forEach((point) => {
    historyByDate.set(point.date, point);
  });
  const history = [...historyByDate.values()].sort((left, right) => String(left.date).localeCompare(String(right.date)));
  if (!history.length) throw new Error('Metals.Dev silver history is empty');
  return {
    provider: 'Metals.Dev 은 현물',
    symbol: 'XAG/USD',
    range,
    history,
  };
}

async function getUsdKrwHistory(range = 'day') {
  const result = await fetchYahooChart(YAHOO_USD_KRW_SYMBOL, range);
  return yahooHistoryFromResult(result, range, '원/달러 환율');
}

function compactDate(date) {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function domesticGoldStartDate(range) {
  const days = { day: 14, week: 30, month: 60, year: 400 }[range] || 14;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function numericField(item, ...keys) {
  for (const key of keys) {
    const value = Number(String(item?.[key] ?? '').replace(/,/g, ''));
    if (Number.isFinite(value)) return value;
  }
  return null;
}

async function getDomesticGold(range = 'day') {
  if (!hasConfiguredEnv('DATA_GO_KR_SERVICE_KEY')) {
    throw new Error('DATA_GO_KR_SERVICE_KEY is not configured');
  }
  const params = new URLSearchParams({
    serviceKey: process.env.DATA_GO_KR_SERVICE_KEY,
    resultType: 'json',
    pageNo: '1',
    numOfRows: '1000',
    beginBasDt: compactDate(domesticGoldStartDate(range)),
    endBasDt: compactDate(new Date()),
  });
  const response = await fetch(`${KRX_GOLD_API_URL}?${params}`, {
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 401) {
    throw new Error('DATA_GO_KR_SERVICE_KEY is unauthorized. Check API approval status or wait until the issued key is activated.');
  }
  if (!response.ok) throw new Error(`KRX gold API failed with ${response.status}`);
  const data = await response.json();
  const resultCode = data.response?.header?.resultCode;
  if (resultCode && resultCode !== '00') {
    throw new Error(data.response?.header?.resultMsg || 'KRX gold API returned an error');
  }
  const rawItems = data.response?.body?.items?.item || [];
  const items = asArray(rawItems)
    .filter((item) => /금\s*99\.99.*1kg|금.*1kg/i.test(item.itmsNm || item.itemName || ''))
    .sort((left, right) => String(left.basDt).localeCompare(String(right.basDt)));
  const selected = items.length ? items : asArray(rawItems).sort((left, right) => String(left.basDt).localeCompare(String(right.basDt)));
  const history = selected.map((item) => ({
    date: item.basDt,
    value: numericField(item, 'clpr', 'closePrice'),
  })).filter((point) => Number.isFinite(point.value));
  if (!history.length) throw new Error('KRX gold price data is empty');
  const latest = selected[selected.length - 1];
  const previous = history[history.length - 2]?.value ?? history[history.length - 1].value;
  const price = history[history.length - 1].value;
  const change = numericField(latest, 'vs', 'priceChange') ?? price - previous;
  const changePercent = numericField(latest, 'fltRt', 'changeRate') ?? (previous ? (change / previous) * 100 : 0);
  return {
    name: '국내 금값',
    symbol: latest.srtnCd || latest.isinCd || 'KRX GOLD 1kg',
    price,
    change,
    changePercent,
    open: numericField(latest, 'mkp', 'openPrice'),
    high: numericField(latest, 'hipr', 'highPrice'),
    low: numericField(latest, 'lopr', 'lowPrice'),
    previousClose: previous,
    volume: numericField(latest, 'trqu', 'tradeVolume'),
    unit: '원/g',
    source: 'KRX 금시장 99.99_1kg',
    updatedAt: latest.basDt,
    isFallback: false,
    range,
    history,
  };
}

function domesticSilverPeriod(range) {
  return {
    day: '1M',
    week: '1M',
    month: '1M',
    year: '1Y',
  }[range] || '1M';
}

async function fetchKoreaGoldxSilver(range = 'day') {
  const body = new URLSearchParams({
    domesicType: 'Ag',
    internationalType: 'Ag',
    domesticDt: domesticSilverPeriod(range),
    internationalDt: range === 'day' ? 'live' : domesticSilverPeriod(range),
  });
  const response = await fetch(KOREA_GOLDX_CHART_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 GoldSignal/1.0',
      Referer: 'https://www.koreagoldx.co.kr/',
    },
    body,
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Korea Gold Exchange silver API failed with ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.domesticList) || !data.domesticList.length) {
    throw new Error('Korea Gold Exchange domestic silver data is empty');
  }
  return data;
}

async function getDomesticSilver(range = 'day') {
  const data = await fetchKoreaGoldxSilver(range);
  const domesticItems = data.domesticList
    .map((item) => ({
      ...item,
      sellPrice3_75g: numericField(item, 's_silver'),
      buyPrice3_75g: numericField(item, 'p_silver'),
    }))
    .filter((item) => Number.isFinite(item.sellPrice3_75g))
    .sort((left, right) => String(left.date).localeCompare(String(right.date)));
  if (!domesticItems.length) throw new Error('Korea Gold Exchange silver sell price is empty');
  const history = domesticItems.map((item) => ({
    date: item.date,
    value: item.sellPrice3_75g / DON_GRAMS,
    sourceValue: item.sellPrice3_75g,
  }));
  const latest = domesticItems[domesticItems.length - 1];
  const latestDiff = data.diff || {};
  const price = latest.sellPrice3_75g / DON_GRAMS;
  const previousPrice = Number(latestDiff.silver_prev1) ? Number(latestDiff.silver_prev1) / DON_GRAMS : (history[history.length - 2]?.value || price);
  const change = price - previousPrice;
  const changePercent = Number(latestDiff.silver_diff1_per) || (previousPrice ? (change / previousPrice) * 100 : 0);

  return {
    name: '국내 은값',
    symbol: 'KoreaGoldX Silver-3.75g',
    price,
    change,
    changePercent,
    previousClose: previousPrice,
    sellPrice3_75g: latest.sellPrice3_75g,
    buyPrice3_75g: latest.buyPrice3_75g,
    unit: '원/g',
    source: '한국금거래소 Silver-3.75g 판매가',
    updatedAt: latest.date || latestDiff.writeday || new Date().toISOString(),
    isFallback: false,
    range,
    history,
  };
}

async function getKoreaGoldxInternationalSilverHistory(range = 'day') {
  const data = await fetchKoreaGoldxSilver(range);
  const history = (data.internationalList || [])
    .map((item) => ({
      date: item.date,
      value: numericField(item, 'ask'),
      bid: numericField(item, 'bid'),
      exchangeRate: numericField(item, 'exchangeRate'),
      krwPerGram: numericField(item, 'domesticPrice'),
    }))
    .filter((item) => item.date && Number.isFinite(item.value))
    .sort((left, right) => String(left.date).localeCompare(String(right.date)));

  if (!history.length) throw new Error('Korea Gold Exchange international silver data is empty');

  return {
    provider: '한국금거래소 국제 은시세',
    symbol: 'KoreaGoldX XAG/USD',
    range,
    history,
    standardPrice: data.standardPrice || {},
  };
}

async function getKoreaGoldxInternationalSilverPrice() {
  const result = await getKoreaGoldxInternationalSilverHistory('day');
  const history = result.history;
  const latest = history[history.length - 1];
  const standard = result.standardPrice || {};
  const previousClose = Number(standard.prev_ask) || history[history.length - 2]?.value || latest.value;
  const change = latest.value - previousClose;

  return {
    symbol: result.symbol,
    name: '국제 은값',
    price: latest.value,
    bid: latest.bid,
    ask: latest.value,
    change,
    changePercent: previousClose ? (change / previousClose) * 100 : 0,
    previousClose,
    gramPriceUsd: latest.value / TROY_OUNCE_GRAMS,
    gramPriceKrw: latest.krwPerGram,
    exchangeRate: latest.exchangeRate || Number(standard.exchange_rate),
    unit: '트로이온스',
    currency: 'USD',
    source: result.provider,
    updatedAt: latest.date || standard.date || new Date().toISOString(),
    isFallback: false,
    history,
  };
}

function lastHistoryValue(history) {
  return [...(history || [])].reverse().find((point) => Number.isFinite(Number(point.value)))?.value ?? null;
}

function alignConvertedMetalHistory(metalHistory, fxHistory) {
  if (!metalHistory?.length || !fxHistory?.length) return [];
  return metalHistory.map((point, index) => {
    const fxPoint = fxHistory[Math.min(index, fxHistory.length - 1)] || fxHistory[fxHistory.length - 1];
    const fxValue = Number(fxPoint?.value);
    const metalValue = Number(point.value);
    return {
      date: point.date,
      value: Number.isFinite(metalValue) && Number.isFinite(fxValue)
        ? (metalValue / TROY_OUNCE_GRAMS) * fxValue
        : null,
    };
  }).filter((point) => Number.isFinite(point.value));
}

function premiumHistoryFrom(domesticHistory, internationalKrwHistory) {
  if (!domesticHistory?.length || !internationalKrwHistory?.length) return [];
  const internationalByDate = new Map(internationalKrwHistory.map((point) => [String(point.date).slice(0, 10).replace(/-/g, ''), Number(point.value)]));
  return domesticHistory.map((point, index) => {
    const compact = String(point.date).slice(0, 10).replace(/-/g, '');
    const international = internationalByDate.get(compact) ?? internationalKrwHistory[Math.min(index, internationalKrwHistory.length - 1)]?.value;
    const domestic = Number(point.value);
    const internationalValue = Number(international);
    return {
      date: point.date,
      value: domestic && internationalValue ? ((domestic / internationalValue) - 1) * 100 : null,
    };
  }).filter((point) => Number.isFinite(point.value));
}

function premiumSnapshot(domesticPrice, internationalKrwPrice) {
  const domestic = Number(domesticPrice);
  const international = Number(internationalKrwPrice);
  if (!Number.isFinite(domestic) || !Number.isFinite(international) || !international) return null;
  const value = ((domestic / international) - 1) * 100;
  return {
    value,
    label: `${Math.abs(value).toFixed(1)}% ${value >= 0 ? '비쌈' : '쌈'}`,
    trend: value > 0 ? 'up' : value < 0 ? 'down' : 'neutral',
  };
}

async function getUsdKrwRate() {
  const history = await getUsdKrwHistory('day');
  const price = Number(lastHistoryValue(history.history));
  const previousClose = Number(history.history[history.history.length - 2]?.value || history.history[0]?.value || price);
  const change = price - previousClose;
  if (!Number.isFinite(price)) throw new Error('USD/KRW data is empty');
  return {
    name: '원/달러 환율',
    symbol: YAHOO_USD_KRW_SYMBOL,
    price,
    change,
    changePercent: previousClose ? (change / previousClose) * 100 : 0,
    previousClose,
    source: history.provider,
    updatedAt: history.history[history.history.length - 1]?.date || new Date().toISOString(),
    history: history.history,
  };
}

function isoDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function rangeStartDate(range) {
  const days = { day: 7, week: 14, month: 45, year: 390 }[range] || 7;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function metalsDevTimestamp(value) {
  if (!value) return new Date().toISOString();
  if (typeof value === 'number') {
    return new Date(value > 100000000000 ? value : value * 1000).toISOString();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function metalsDevNumber(value) {
  if (value && typeof value === 'object') {
    return metalsDevNumber(value.silver ?? value.XAG ?? value.xag ?? value.metals?.silver ?? value.price ?? value.value ?? value.rate);
  }
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function metalsDevSilverValue(data) {
  return metalsDevNumber(
    data?.metals?.silver
      ?? data?.metals?.XAG
      ?? data?.rates?.silver
      ?? data?.rates?.XAG
      ?? data?.data?.silver
      ?? data?.silver,
  );
}

function metalsDevSeriesPoints(data) {
  const series = data?.rates ?? data?.metals ?? data?.data ?? data?.prices ?? {};
  if (Array.isArray(series)) {
    return series.map((item) => ({
      date: item.date || item.timestamp || item.time,
      value: metalsDevSilverValue(item) ?? metalsDevNumber(item),
    })).filter((point) => point.date && Number.isFinite(point.value));
  }

  return Object.entries(series).map(([date, value]) => ({
    date,
    value: metalsDevNumber(value),
  })).filter((point) => point.date && Number.isFinite(point.value));
}

async function fetchMetalsDev(endpoint, params) {
  if (!hasConfiguredEnv('METALS_DEV_API_KEY')) {
    throw new Error('METALS_DEV_API_KEY is not configured');
  }
  const query = new URLSearchParams({
    api_key: process.env.METALS_DEV_API_KEY,
    currency: 'USD',
    unit: 'toz',
    ...params,
  });
  const response = await fetch(`${METALS_DEV_API_BASE_URL}/${endpoint}?${query}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(7000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error_message || data.message || data.error?.message || `Metals.Dev API failed with ${response.status}`);
  }
  if (data.status === 'error' || data.status === 'failure' || data.error || data.error_message) {
    throw new Error(data.message || data.error_message || data.error?.message || 'Metals.Dev API returned an error');
  }
  return data;
}

async function getSilverPrice() {
  try {
    return await getKoreaGoldxInternationalSilverPrice();
  } catch (error) {
    if (!hasConfiguredEnv('METALS_DEV_API_KEY')) throw error;
  }

  const [latest, historyResult] = await Promise.all([
    fetchMetalsDev('latest', {}),
    getSilverHistory('day').catch(() => null),
  ]);
  const price = metalsDevSilverValue(latest);
  if (!Number.isFinite(price)) throw new Error('Metals.Dev silver price is empty');
  const history = historyResult?.history || [];
  const previousClose = Number(history[history.length - 2]?.value || history[0]?.value || price);
  const change = price - previousClose;
  return {
    symbol: 'XAG/USD',
    name: '국제 은값',
    price,
    change,
    changePercent: previousClose ? (change / previousClose) * 100 : 0,
    previousClose,
    unit: '트로이온스',
    currency: 'USD',
    source: 'Metals.Dev 은 현물',
    updatedAt: metalsDevTimestamp(latest.timestamp),
    isFallback: false,
    history,
  };
}

async function getMarketSnapshot() {
  const [gold, silver, fx, domesticGoldResult, domesticSilverResult, goldHistoryResult, silverHistoryResult, fxHistoryResult] = await Promise.allSettled([
    getGoldPrice(),
    getSilverPrice(),
    getUsdKrwRate(),
    getDomesticGold('day'),
    getDomesticSilver('day'),
    getGoldHistory('day'),
    getSilverHistory('day'),
    getUsdKrwHistory('day'),
  ]);

  const goldValue = gold.status === 'fulfilled' ? gold.value : fallbackGoldPrice;
  const silverValue = silver.status === 'fulfilled' ? silver.value : null;
  const silverError = silver.status === 'rejected' ? silver.reason?.message : null;
  const fxValue = fx.status === 'fulfilled' ? fx.value : null;
  const domesticGoldValue = domesticGoldResult.status === 'fulfilled' ? domesticGoldResult.value : null;
  const domesticSilverValue = domesticSilverResult.status === 'fulfilled' ? domesticSilverResult.value : null;
  const goldHistory = goldHistoryResult.status === 'fulfilled' ? goldHistoryResult.value.history : [];
  const silverHistory = silverHistoryResult.status === 'fulfilled' ? silverHistoryResult.value.history : [];
  const fxHistory = fxHistoryResult.status === 'fulfilled' ? fxHistoryResult.value.history : fxValue?.history || [];
  const goldKrwHistory = alignConvertedMetalHistory(goldHistory, fxHistory);
  const silverKrwHistory = silverHistory.some((point) => Number.isFinite(Number(point.krwPerGram)))
    ? silverHistory
      .map((point) => ({ date: point.date, value: Number(point.krwPerGram) }))
      .filter((point) => Number.isFinite(point.value))
    : alignConvertedMetalHistory(silverHistory, fxHistory);
  const goldWithHistory = { ...goldValue, history: goldHistory };
  const silverWithHistory = silverValue ? { ...silverValue, history: silverHistory } : null;
  const goldInternationalKrw = Number(goldValue.price) / TROY_OUNCE_GRAMS * Number(fxValue?.price);
  const silverInternationalKrw = Number(silverValue?.gramPriceKrw) || (Number(silverValue?.price) / TROY_OUNCE_GRAMS * Number(fxValue?.price));
  const goldPremium = premiumSnapshot(domesticGoldValue?.price, goldInternationalKrw);
  const goldPremiumHistory = premiumHistoryFrom(domesticGoldValue?.history || [], goldKrwHistory);
  const silverPremium = premiumSnapshot(domesticSilverValue?.price, silverInternationalKrw);
  const silverPremiumHistory = premiumHistoryFrom(domesticSilverValue?.history || [], silverKrwHistory);

  return {
    provider: 'COMEX 금 선물 + KRX 금시장 + 한국금거래소',
    updatedAt: new Date().toISOString(),
    gold: goldWithHistory,
    domesticGold: domesticGoldValue,
    goldPremium: goldPremium ? { ...goldPremium, history: goldPremiumHistory } : null,
    silver: silverWithHistory,
    silverError,
    domesticSilver: domesticSilverValue,
    silverPremium: silverPremium ? {
      ...silverPremium,
      history: silverPremiumHistory,
      note: '한국금거래소 Silver-3.75g 판매가를 1g으로 환산해 국제 은 현물 원화 환산가와 비교한 값입니다.',
    } : null,
    fx: fxValue,
  };
}

async function getMarketHistory(kind, range = 'day') {
  if (kind === 'silver') return getSilverHistory(range);
  if (kind === 'domestic-silver') {
    const silver = await getDomesticSilver(range);
    return {
      provider: silver.source,
      symbol: silver.symbol,
      range,
      history: silver.history,
    };
  }
  if (kind === 'silver-premium') {
    const [domesticSilver, silverHistory, fxHistory] = await Promise.all([
      getDomesticSilver(range),
      getSilverHistory(range),
      getUsdKrwHistory(range),
    ]);
    return {
      provider: '한국금거래소 / Metals.Dev 은 현물 환산',
      symbol: 'KoreaGoldX silver premium',
      range,
      history: premiumHistoryFrom(domesticSilver.history, alignConvertedMetalHistory(silverHistory.history, fxHistory.history)),
    };
  }
  if (kind === 'gold-premium') {
    const [domesticGold, goldHistory, fxHistory] = await Promise.all([
      getDomesticGold(range),
      getGoldHistory(range),
      getUsdKrwHistory(range),
    ]);
    return {
      provider: 'KRX 금시장 / 국제 금선물 환산',
      symbol: 'KRX GOLD premium',
      range,
      history: premiumHistoryFrom(domesticGold.history, alignConvertedMetalHistory(goldHistory.history, fxHistory.history)),
    };
  }
  return getGoldHistory(range);
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function scoreNewsItem(article) {
  const text = [
    article.title,
    article.description,
    article.content,
  ].filter(Boolean).join(' ');

  const matched = newsSignals.filter((signal) => signal.pattern.test(text));
  const matchedTags = matched.map((signal) => signal.tag);
  const hasGoldMarketContext = matchedTags.includes('금');
  const hasMacroContext = matchedTags.some((tag) => ['금리', '연준 인사', '미국 국채금리', '달러', '인플레이션', 'PCE', 'CPI', '유가', '중앙은행 금 매입'].includes(tag));
  const hasGeopoliticalContext = matchedTags.some((tag) => ['지정학 리스크', '중동 리스크'].includes(tag))
    && /(iran|israel|gaza|middle east|red sea|houthi|tehran|russia|russian|ukraine|oil|sanction)/i.test(text)
    && /(war|conflict|ceasefire|sanction|oil|safe haven|geopolitical|missile|attack|nuclear|negotiation)/i.test(text);
  const hasTrumpMarketContext = matchedTags.includes('트럼프·관세')
    && /(tariff|federal reserve|powell|warsh|\brate\b|rates|dollar|inflation|iran|israel|middle east|sanction|oil|fed\b)/i.test(text);
  const hasExcludedDomesticContext = /(homelessness|housing first|commercial driver|driver's seat|ai model|artificial intelligence|intelligence role|correspondents' dinner|olympic gold|soccer|watch collection|primary election|primaries)/i.test(text);

  if (hasExcludedDomesticContext && !hasGoldMarketContext && !hasMacroContext && !hasGeopoliticalContext) {
    return {
      score: 0,
      tags: [],
      assets: [],
      highlights: [],
    };
  }

  if (!hasGoldMarketContext && !hasMacroContext && !hasGeopoliticalContext && !hasTrumpMarketContext) {
    return {
      score: 0,
      tags: [],
      assets: [],
      highlights: [],
    };
  }

  const score = Math.min(98, 42 + matched.reduce((total, signal) => total + signal.score, 0));

  return {
    score,
    tags: uniqueValues(matched.map((signal) => signal.tag)).slice(0, 4),
    assets: uniqueValues(['국제 금', ...matched.map((signal) => signal.asset)]).slice(0, 4),
    highlights: uniqueValues(matched.map((signal) => signal.highlight)).slice(0, 3),
  };
}

function normalizeNewsArticle(article, index, provider) {
  const sourceName = typeof article.source === 'string'
    ? article.source
    : article.source?.name;
  const signal = scoreNewsItem(article);
  const publishedAt = article.publishedAt || article.published_at || new Date().toISOString();
  const title = article.title || '제목 확인 중';
  const description = article.description || article.content || '원문에서 세부 내용을 확인할 수 있습니다.';

  return {
    id: `${provider}-${Buffer.from(title.toLowerCase()).toString('base64url').slice(0, 24)}`,
    titleKo: null,
    titleOriginal: title,
    source: sourceName || provider,
    publishedAt,
    url: article.url || '#',
    tags: signal.tags.length ? signal.tags : ['금 시장'],
    priority: signal.score >= 82 ? '속보' : signal.score >= 68 ? '중요' : '일반',
    impactScore: signal.score,
    relatedAssets: signal.assets,
    highlights: signal.highlights.length ? signal.highlights : ['금값 영향 요인 확인 필요'],
    summaryKo: null,
    summaryOriginal: description,
    clusterKey: `${provider}-${sourceName || 'source'}-${index}`,
    duplicateCount: 1,
    clusterSources: [sourceName || provider],
    translationAvailable: false,
    sourceType: article.sourceType || 'media',
    country: article.country || '',
  };
}

function newsTitleTokens(title) {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'as', 'at', 'with', 'from', 'after', 'amid']);
  return new Set(String(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token)));
}

function newsTitleSimilarity(leftTitle, rightTitle) {
  const left = newsTitleTokens(leftTitle);
  const right = newsTitleTokens(rightTitle);
  if (!left.size || !right.size) return 0;
  const intersection = [...left].filter((token) => right.has(token)).length;
  return intersection / Math.min(left.size, right.size);
}

function clusterDuplicateNews(items) {
  return items.reduce((clusters, item) => {
    const existing = clusters.find((candidate) => newsTitleSimilarity(candidate.titleOriginal, item.titleOriginal) >= 0.72);
    if (!existing) {
      clusters.push(item);
      return clusters;
    }

    existing.duplicateCount += 1;
    existing.clusterSources = uniqueValues([...existing.clusterSources, item.source]);
    existing.tags = uniqueValues([...existing.tags, ...item.tags]).slice(0, 4);
    existing.relatedAssets = uniqueValues([...existing.relatedAssets, ...item.relatedAssets]).slice(0, 4);
    existing.highlights = uniqueValues([...existing.highlights, ...item.highlights]).slice(0, 3);
    if (item.impactScore > existing.impactScore) {
      existing.impactScore = item.impactScore;
      existing.priority = item.priority;
    }
    return clusters;
  }, []);
}

function decodeTranslatedText(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function translateNewsItems(items) {
  if (!items.length) return items;

  if (hasConfiguredEnv('GOOGLE_TRANSLATE_API_KEY')) {
    try {
      const texts = items.flatMap((item) => [item.titleOriginal, item.summaryOriginal]);
      const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?key=${encodeURIComponent(process.env.GOOGLE_TRANSLATE_API_KEY)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: texts, source: 'en', target: 'ko', format: 'text' }),
      });
      if (!response.ok) throw new Error(`Google Translate failed with ${response.status}`);

      const data = await response.json();
      const translations = data.data?.translations || [];
      if (translations.length === texts.length) {
        return items.map((item, index) => ({
          ...item,
          titleKo: decodeTranslatedText(translations[index * 2].translatedText),
          summaryKo: decodeTranslatedText(translations[index * 2 + 1].translatedText),
          translationAvailable: true,
        }));
      }
    } catch (error) {
      // Continue with the keyless fallback below.
    }
  }

  return Promise.all(items.map(async (item) => {
    const [titleKo, summaryKo] = await Promise.all([
      translateWithMyMemory(item.titleOriginal),
      translateWithMyMemory(item.summaryOriginal),
    ]);
    return {
      ...item,
      titleKo: titleKo || item.titleOriginal,
      summaryKo: summaryKo || item.summaryOriginal,
      translationAvailable: Boolean(titleKo || summaryKo),
    };
  }));
}

function truncateTranslationText(value, maxBytes = 480) {
  let result = String(value || '').trim();
  while (Buffer.byteLength(result, 'utf8') > maxBytes) result = result.slice(0, -1);
  return result;
}

async function translateWithMyMemory(value) {
  const sourceText = truncateTranslationText(value);
  if (!sourceText) return '';
  if (newsTranslationCache.has(sourceText)) return newsTranslationCache.get(sourceText);

  const params = new URLSearchParams({ q: sourceText, langpair: 'en|ko', mt: '1' });
  if (hasConfiguredEnv('MYMEMORY_EMAIL')) params.set('de', process.env.MYMEMORY_EMAIL.trim());

  try {
    const response = await fetch(`${MYMEMORY_TRANSLATE_API_URL}?${params}`);
    if (!response.ok) return '';
    const data = await response.json();
    const translated = decodeTranslatedText(data.responseData?.translatedText || '');
    const result = translated && translated.toLowerCase() !== sourceText.toLowerCase() ? translated : '';
    newsTranslationCache.set(sourceText, result);
    return result;
  } catch (error) {
    return '';
  }
}

function relevantNewsItems(articles, provider) {
  return articles
    .map((article, index) => normalizeNewsArticle(article, index, provider))
    .filter((item) => item.impactScore >= NEWS_MIN_SCORE);
}

async function finalizeNewsItems(items) {
  const clustered = clusterDuplicateNews(items)
    .sort((left, right) => new Date(right.publishedAt) - new Date(left.publishedAt))
    .slice(0, NEWS_PAGE_SIZE);

  try {
    return await translateNewsItems(clustered);
  } catch (error) {
    return clustered;
  }
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function textValue(value) {
  if (typeof value === 'string') return value;
  return value?.['#text'] || value?.text || '';
}

function officialNewsFeeds() {
  if (!hasConfiguredEnv('OFFICIAL_NEWS_FEEDS_JSON')) return defaultOfficialNewsFeeds;
  try {
    const feeds = JSON.parse(process.env.OFFICIAL_NEWS_FEEDS_JSON);
    return Array.isArray(feeds) ? feeds.filter((feed) => feed.name && feed.url) : defaultOfficialNewsFeeds;
  } catch (error) {
    return defaultOfficialNewsFeeds;
  }
}

async function getNewsFromOfficialFeeds() {
  const results = await Promise.allSettled(officialNewsFeeds().map(async (feed) => {
    const response = await fetch(feed.url, {
      headers: { 'User-Agent': 'GoldSignal/1.0 news aggregator' },
      signal: AbortSignal.timeout(NEWS_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`${feed.name} RSS failed with ${response.status}`);
    const parsed = xmlParser.parse(await response.text());
    const entries = asArray(parsed.rss?.channel?.item || parsed.feed?.entry);
    return entries.map((entry) => ({
      title: textValue(entry.title),
      description: textValue(entry.description || entry.summary || entry.content),
      url: entry.link?.['@_href'] || textValue(entry.link) || textValue(entry.guid),
      publishedAt: textValue(entry.pubDate || entry.published || entry.updated),
      source: { name: feed.name },
      sourceType: 'official',
    }));
  }));

  return {
    provider: '공식기관',
    items: results.flatMap((result) => result.status === 'fulfilled' ? result.value : []),
  };
}

async function getNewsFromGoogleNewsRss() {
  const results = await Promise.allSettled(googleNewsTopics.map(async (query) => {
    const params = new URLSearchParams({ q: query, hl: 'en-US', gl: 'US', ceid: 'US:en' });
    const response = await fetch(`https://news.google.com/rss/search?${params}`, {
      headers: { 'User-Agent': 'GoldSignal/1.0 news aggregator' },
      signal: AbortSignal.timeout(NEWS_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Google News RSS failed with ${response.status}`);
    const parsed = xmlParser.parse(await response.text());
    return asArray(parsed.rss?.channel?.item).map((entry) => ({
      title: textValue(entry.title),
      description: textValue(entry.description),
      url: textValue(entry.link),
      publishedAt: textValue(entry.pubDate),
      source: { name: textValue(entry.source) || 'Google News' },
      sourceType: 'news-index',
    }));
  }));

  return {
    provider: 'Google News 실시간',
    items: results.flatMap((result) => result.status === 'fulfilled' ? result.value : []),
  };
}

async function getNewsFromGdelt() {
  if (process.env.GDELT_ENABLED === 'false') return { provider: 'GDELT', items: [] };
  const query = process.env.GDELT_QUERY
    || '(gold OR bullion OR "central bank") (rate OR purchase OR reserve OR tariff OR sanction OR import OR inflation OR yen OR dollar)';
  const params = new URLSearchParams({
    query,
    mode: 'artlist',
    maxrecords: String(Math.min(Math.max(NEWS_PAGE_SIZE * 4, 25), 250)),
    format: 'json',
    sort: 'datedesc',
  });
  const response = await fetch(`${GDELT_API_BASE_URL}?${params}`, {
    signal: AbortSignal.timeout(NEWS_FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`GDELT failed with ${response.status}`);
  const data = await response.json();
  return {
    provider: 'GDELT',
    items: (data.articles || []).map((article) => ({
      title: article.title,
      description: article.title,
      url: article.url,
      publishedAt: article.seendate,
      source: { name: article.domain || 'GDELT' },
      country: article.sourcecountry || '',
      sourceType: 'global-monitoring',
    })),
  };
}

async function getNewsFromNewsApi(page = 1) {
  const params = new URLSearchParams({
    q: NEWS_QUERY,
    searchIn: 'title,description',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: String(Math.min(Math.max(NEWS_PAGE_SIZE * 4, 20), 100)),
    page: String(page),
    apiKey: process.env.NEWS_API_KEY,
  });

  const response = await fetch(`${NEWS_API_BASE_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`NewsAPI failed with ${response.status}`);
  }

  const data = await response.json();
  if (data.status === 'error') {
    throw new Error(data.message || 'NewsAPI returned an error');
  }

  return {
    provider: 'NewsAPI.org',
    items: data.articles || [],
  };
}

async function getNewsFromGNews(page = 1) {
  const params = new URLSearchParams({
    q: NEWS_QUERY,
    lang: 'en',
    country: 'us',
    max: String(Math.min(Math.max(NEWS_PAGE_SIZE, 1), 10)),
    page: String(page),
    apikey: process.env.GNEWS_API_KEY,
  });

  const response = await fetch(`${GNEWS_API_BASE_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`GNews failed with ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(Array.isArray(data.errors) ? data.errors.join(', ') : JSON.stringify(data.errors));
  }

  return {
    provider: 'GNews',
    items: data.articles || [],
  };
}

async function getNews(page = 1) {
  try {
    const providers = [];
    if (hasConfiguredEnv('NEWS_API_KEY')) providers.push(getNewsFromNewsApi(page));
    if (hasConfiguredEnv('GNEWS_API_KEY')) providers.push(getNewsFromGNews(page));
    if (page === 1) providers.push(getNewsFromGoogleNewsRss(), getNewsFromOfficialFeeds(), getNewsFromGdelt());
    const results = await Promise.allSettled(providers);
    const successful = results.filter((result) => result.status === 'fulfilled').map((result) => result.value);
    const normalized = successful.flatMap((result) => relevantNewsItems(result.items, result.provider.toLowerCase().replace(/\W+/g, '-')));
    const items = await finalizeNewsItems(normalized);
    if (items.length) return { provider: successful.map((result) => result.provider).join(' + '), items };
    return { provider: page === 1 ? 'sample' : 'global', items: page === 1 ? newsFeed : [] };
  } catch (error) {
    return {
      provider: 'sample',
      error: error.message,
      items: page === 1 ? newsFeed : [],
    };
  }
}

async function getLatestNewsSnapshot(force = false) {
  if (!force && latestNewsSnapshot && Date.now() - latestNewsSnapshotAt < 30000) return latestNewsSnapshot;
  latestNewsSnapshot = await getNews(1);
  latestNewsSnapshotAt = Date.now();
  return latestNewsSnapshot;
}

async function broadcastLatestNews() {
  if (!newsStreamClients.size) return;
  const news = await getLatestNewsSnapshot(true);
  const payload = `data: ${JSON.stringify({ ...news, updatedAt: new Date().toISOString() })}\n\n`;
  newsStreamClients.forEach((client) => client.write(payload));
}

async function getGoldPrice() {
  if (!hasConfiguredEnv('GOLD_API_KEY')) {
    try {
      return normalizeYahooGoldResponse(await fetchYahooGoldChart('day'));
    } catch (error) {
      return { ...fallbackGoldPrice, error: error.message };
    }
  }

  try {
    const endpoint = [
      GOLD_API_BASE_URL,
      encodeURIComponent(GOLD_API_SYMBOL),
      encodeURIComponent(GOLD_API_CURRENCY),
      GOLD_API_DATE ? encodeURIComponent(GOLD_API_DATE) : '',
    ].filter(Boolean).join('/');

    const response = await fetch(endpoint, {
      headers: {
        'x-access-token': process.env.GOLD_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Gold API failed with ${response.status}`);
    }

    const data = await response.json();
    return normalizeGoldApiResponse(data);
  } catch (error) {
    return {
      ...fallbackGoldPrice,
      error: error.message,
      updatedAt: new Date().toISOString(),
    };
  }
}

function validFredObservations(observations = []) {
  return observations
    .filter((item) => item.value && item.value !== '.')
    .map((item) => ({
      date: item.date,
      value: Number(item.value),
    }))
    .filter((item) => Number.isFinite(item.value));
}

async function getFredSeries(seriesId, limit = 14) {
  if (!hasConfiguredEnv('FRED_API_KEY')) return [];

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: process.env.FRED_API_KEY,
    file_type: 'json',
    sort_order: 'desc',
    limit: String(limit),
  });

  const response = await fetch(`${FRED_API_BASE_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`FRED ${seriesId} failed with ${response.status}`);
  }

  const data = await response.json();
  return validFredObservations(data.observations);
}

async function getOptionalFredSeries(seriesId, limit = 14) {
  try {
    return await getFredSeries(seriesId, limit);
  } catch (error) {
    return [];
  }
}

async function getYahooIndicatorSeries(symbol, formatter = (value) => value) {
  try {
    const params = new URLSearchParams({ range: '1y', interval: '1d', includePrePost: 'false' });
    const response = await fetch(`${YAHOO_FINANCE_CHART_BASE_URL}/${encodeURIComponent(symbol)}?${params}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 GoldSignal/1.0' },
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) throw new Error(`${symbol} indicator API failed with ${response.status}`);
    const data = await response.json();
    const result = data.chart?.result?.[0];
    if (!result) throw new Error(data.chart?.error?.description || `${symbol} indicator data is unavailable`);
    const history = yahooHistoryFromResult(result, 'year', symbol).history
      .map((point) => ({
        date: point.date,
        value: formatter(point.value),
      }))
      .filter((point) => Number.isFinite(point.value));
    return history.reverse();
  } catch (error) {
    return [];
  }
}

function pctChange(current, previous) {
  if (!previous) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function formatPercentPoint(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%p`;
}

function formatPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function indicatorImpact(direction, delta) {
  if (Math.abs(delta) < 0.005) return 'neutral';
  if (direction === 'higherSupportsGold') return delta > 0 ? 'up' : 'down';
  return delta > 0 ? 'down' : 'up';
}

function indicatorHistory(series = [], formatter = (value) => value) {
  return [...series]
    .reverse()
    .map((item) => ({ date: item.date, value: formatter(item.value) }))
    .filter((item) => Number.isFinite(item.value));
}

function dailyRateIndicator(name, series, direction, summary, related) {
  const [latest, previous] = series;
  const delta = latest.value - previous.value;
  return {
    name,
    value: `${latest.value.toFixed(2)}%`,
    compare: `전일 ${previous.value.toFixed(2)}%`,
    change: formatPercentPoint(delta),
    impact: indicatorImpact(direction, delta),
    summary,
    related,
    history: indicatorHistory(series),
  };
}

function dailyValueIndicator(name, series, direction, formatter, summary, related) {
  const [latest, previous] = series;
  const delta = pctChange(latest.value, previous.value);
  return {
    name,
    value: formatter(latest.value),
    compare: `전일 ${formatter(previous.value)}`,
    change: formatPercent(delta),
    impact: indicatorImpact(direction, delta),
    summary,
    related,
    history: indicatorHistory(series),
  };
}

function periodRateIndicator(name, series, direction, summary, related) {
  const [latest, previous] = series;
  const delta = latest.value - previous.value;
  return {
    name,
    value: `${latest.value.toFixed(1)}%`,
    compare: `이전 ${previous.value.toFixed(1)}%`,
    change: formatPercentPoint(delta),
    impact: indicatorImpact(direction, delta),
    summary,
    related,
    history: indicatorHistory(series),
  };
}

function yoy(series) {
  if (series.length < 13) return null;
  return pctChange(series[0].value, series[12].value);
}

function monthlyYoyIndicator(name, series, summary, related) {
  const currentYoy = yoy(series);
  const previousYoy = series.length > 13 ? pctChange(series[1].value, series[13].value) : currentYoy;
  const delta = currentYoy - previousYoy;

  return {
    name,
    value: `${currentYoy.toFixed(1)}%`,
    compare: `이전 ${previousYoy.toFixed(1)}%`,
    change: formatPercentPoint(delta),
    impact: indicatorImpact('higherHurtsGold', delta),
    summary,
    related,
    history: series
      .slice(0, Math.max(0, series.length - 12))
      .map((item, index) => ({
        date: item.date,
        value: pctChange(item.value, series[index + 12].value),
      }))
      .reverse(),
  };
}

function withIndicatorSource(indicator, source) {
  return {
    ...indicator,
    source,
    isRealData: true,
  };
}

function pendingIndicator(fallback, source) {
  return {
    ...fallback,
    value: '연동 대기',
    compare: '공식 데이터 연동 필요',
    change: '-',
    impact: 'neutral',
    history: [],
    source,
    isPending: true,
    isRealData: false,
  };
}

function buildIndicator(series, fallback, source, build) {
  if (!Array.isArray(series) || series.length < 2) {
    return pendingIndicator(fallback, source);
  }

  return withIndicatorSource(build(series), source);
}

async function getIndicators() {
  const [
    realYield,
    treasury10y,
    debtToGdp,
    dollarIndex,
    krw,
    wti,
    pce,
    corePce,
    cpi,
    coreCpi,
    payrolls,
    unemployment,
    wages,
    retailSales,
    gdp,
    gld,
  ] = await Promise.all([
    getOptionalFredSeries('DFII10', 260),
    getYahooIndicatorSeries(YAHOO_TREASURY_10Y_SYMBOL),
    getOptionalFredSeries('GFDEGDQ188S', 12),
    getYahooIndicatorSeries(YAHOO_DXY_SYMBOL),
    getYahooIndicatorSeries(YAHOO_USD_KRW_SYMBOL),
    getYahooIndicatorSeries(YAHOO_WTI_SYMBOL),
    getOptionalFredSeries('PCEPI', 72),
    getOptionalFredSeries('PCEPILFE', 72),
    getOptionalFredSeries('CPIAUCSL', 72),
    getOptionalFredSeries('CPILFESL', 72),
    getOptionalFredSeries('PAYEMS', 24),
    getOptionalFredSeries('UNRATE', 24),
    getOptionalFredSeries('CES0500000003', 24),
    getOptionalFredSeries('RSAFS', 24),
    getOptionalFredSeries('A191RL1Q225SBEA', 12),
    getYahooIndicatorSeries(YAHOO_GLD_SYMBOL),
  ]);

  const daily = [
    buildIndicator(realYield, fallbackIndicators.daily[0], 'FRED DFII10', (series) => dailyRateIndicator('미국 10년물 실질금리', series, 'higherHurtsGold', fallbackIndicators.daily[0].summary, fallbackIndicators.daily[0].related)),
    buildIndicator(treasury10y, fallbackIndicators.daily[1], 'Yahoo Finance ^TNX', (series) => dailyRateIndicator('미국 10년물 국채금리', series, 'higherHurtsGold', fallbackIndicators.daily[1].summary, fallbackIndicators.daily[1].related)),
    buildIndicator(debtToGdp, fallbackIndicators.daily[2], 'FRED GFDEGDQ188S', (series) => periodRateIndicator('미국 GDP 대비 부채 비율', series, 'higherSupportsGold', fallbackIndicators.daily[2].summary, fallbackIndicators.daily[2].related)),
    buildIndicator(dollarIndex, fallbackIndicators.daily[3], 'Yahoo Finance DX-Y.NYB', (series) => dailyValueIndicator('달러지수 DXY', series, 'higherHurtsGold', (value) => value.toFixed(2), fallbackIndicators.daily[3].summary, fallbackIndicators.daily[3].related)),
    buildIndicator(krw, fallbackIndicators.daily[4], 'Yahoo Finance KRW=X', (series) => dailyValueIndicator('원/달러 환율', series, 'higherSupportsGold', (value) => `${value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}원`, fallbackIndicators.daily[4].summary, fallbackIndicators.daily[4].related)),
    buildIndicator(wti, fallbackIndicators.daily[5], 'Yahoo Finance CL=F', (series) => dailyValueIndicator('유가', series, 'higherSupportsGold', (value) => `$${value.toFixed(2)}`, fallbackIndicators.daily[5].summary, fallbackIndicators.daily[5].related)),
    buildIndicator(gld, fallbackIndicators.daily[6], 'Yahoo Finance GLD', (series) => dailyValueIndicator('GLD ETF 가격', series, 'higherSupportsGold', (value) => `$${value.toFixed(2)}`, fallbackIndicators.daily[6].summary, fallbackIndicators.daily[6].related)),
  ];

  const monthly = [
    buildIndicator(pce, fallbackIndicators.monthly[0], 'FRED PCEPI', (series) => monthlyYoyIndicator('PCE', series, fallbackIndicators.monthly[0].summary, fallbackIndicators.monthly[0].related)),
    buildIndicator(corePce, fallbackIndicators.monthly[1], 'FRED PCEPILFE', (series) => monthlyYoyIndicator('근원 PCE', series, fallbackIndicators.monthly[1].summary, fallbackIndicators.monthly[1].related)),
    buildIndicator(cpi, fallbackIndicators.monthly[2], 'FRED CPIAUCSL', (series) => monthlyYoyIndicator('CPI', series, fallbackIndicators.monthly[2].summary, fallbackIndicators.monthly[2].related)),
    buildIndicator(coreCpi, fallbackIndicators.monthly[3], 'FRED CPILFESL', (series) => monthlyYoyIndicator('근원 CPI', series, fallbackIndicators.monthly[3].summary, fallbackIndicators.monthly[3].related)),
  ];

  if (payrolls.length >= 3) {
    const payrollDelta = payrolls[0].value - payrolls[1].value;
    monthly.push(withIndicatorSource({
      name: '고용보고서',
      value: `${payrollDelta >= 0 ? '+' : ''}${Math.round(payrollDelta)}K`,
      compare: `이전 ${Math.round(payrolls[1].value - payrolls[2].value)}K`,
      change: payrollDelta >= 0 ? '고용 증가' : '고용 둔화',
      impact: payrollDelta < 0 ? 'up' : 'down',
      summary: fallbackIndicators.monthly[4].summary,
      related: fallbackIndicators.monthly[4].related,
      history: payrolls
        .slice(0, -1)
        .map((item, index) => ({ date: item.date, value: item.value - payrolls[index + 1].value }))
        .reverse(),
    }, 'FRED PAYEMS'));
  } else {
    monthly.push(pendingIndicator(fallbackIndicators.monthly[4], 'FRED PAYEMS'));
  }

  if (unemployment.length >= 2) {
    const unemploymentDelta = unemployment[0].value - unemployment[1].value;
    monthly.push(withIndicatorSource({
      name: '실업률',
      value: `${unemployment[0].value.toFixed(1)}%`,
      compare: `이전 ${unemployment[1].value.toFixed(1)}%`,
      change: unemploymentDelta >= 0 ? '실업률 상승' : '실업률 하락',
      impact: unemploymentDelta >= 0 ? 'up' : 'down',
      summary: fallbackIndicators.monthly[5].summary,
      related: fallbackIndicators.monthly[5].related,
      history: indicatorHistory(unemployment),
    }, 'FRED UNRATE'));
  } else {
    monthly.push(pendingIndicator(fallbackIndicators.monthly[5], 'FRED UNRATE'));
  }

  if (wages.length >= 2) {
    const wageDelta = wages[0].value - wages[1].value;
    monthly.push(withIndicatorSource({
      name: '임금',
      value: formatPercent(pctChange(wages[0].value, wages[1].value)),
      compare: `이전 ${wages[1].value.toFixed(2)}`,
      change: wageDelta >= 0 ? '임금 상승' : '임금 둔화',
      impact: wageDelta >= 0 ? 'down' : 'up',
      summary: fallbackIndicators.monthly[6].summary,
      related: fallbackIndicators.monthly[6].related,
      history: wages
        .slice(0, -1)
        .map((item, index) => ({ date: item.date, value: pctChange(item.value, wages[index + 1].value) }))
        .reverse(),
    }, 'FRED CES0500000003'));
  } else {
    monthly.push(pendingIndicator(fallbackIndicators.monthly[6], 'FRED CES0500000003'));
  }

  if (retailSales.length >= 2) {
    const retailDelta = pctChange(retailSales[0].value, retailSales[1].value);
    monthly.push(withIndicatorSource({
      name: '소매판매',
      value: formatPercent(retailDelta),
      compare: `전월 ${retailSales[1].value.toLocaleString('en-US')}`,
      change: retailDelta >= 0 ? '소비 증가' : '소비 둔화',
      impact: retailDelta >= 0 ? 'down' : 'up',
      summary: fallbackIndicators.monthly[7].summary,
      related: fallbackIndicators.monthly[7].related,
      history: retailSales
        .slice(0, -1)
        .map((item, index) => ({ date: item.date, value: pctChange(item.value, retailSales[index + 1].value) }))
        .reverse(),
    }, 'FRED RSAFS'));
  } else {
    monthly.push(pendingIndicator(fallbackIndicators.monthly[7], 'FRED RSAFS'));
  }

  if (gdp.length >= 2) {
    const gdpDelta = gdp[0].value - gdp[1].value;
    monthly.push(withIndicatorSource({
      name: 'GDP',
      value: `${gdp[0].value.toFixed(1)}%`,
      compare: `이전 ${gdp[1].value.toFixed(1)}%`,
      change: gdpDelta >= 0 ? '성장 확대' : '성장 둔화',
      impact: gdpDelta >= 0 ? 'down' : 'up',
      summary: fallbackIndicators.monthly[8].summary,
      related: fallbackIndicators.monthly[8].related,
      history: indicatorHistory(gdp),
    }, 'FRED A191RL1Q225SBEA'));
  } else {
    monthly.push(pendingIndicator(fallbackIndicators.monthly[8], 'FRED A191RL1Q225SBEA'));
  }

  monthly.push(pendingIndicator(fallbackIndicators.monthly[9], '세계금협회/공식 중앙은행 금 보유량 API 필요'));

  return {
    provider: hasConfiguredEnv('FRED_API_KEY') ? 'Yahoo Finance + FRED' : 'Yahoo Finance',
    needsFredApiKey: !hasConfiguredEnv('FRED_API_KEY'),
    updatedAt: new Date().toISOString(),
    daily,
    monthly,
  };
}

function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/health') {
    sendJson(res, {
      status: 'ok',
      updatedAt: new Date().toISOString(),
      port,
      services: {
        goldApi: {
          configured: true,
          provider: hasConfiguredEnv('GOLD_API_KEY') ? 'GoldAPI.io' : 'COMEX 금 선물',
          symbol: `${GOLD_API_SYMBOL}/${GOLD_API_CURRENCY}`,
        },
        fred: {
          configured: hasConfiguredEnv('FRED_API_KEY'),
          provider: hasConfiguredEnv('FRED_API_KEY') ? 'FRED' : 'FRED API key required for release indicators',
        },
        domesticGold: {
          configured: hasConfiguredEnv('DATA_GO_KR_SERVICE_KEY'),
          provider: hasConfiguredEnv('DATA_GO_KR_SERVICE_KEY') ? 'KRX 금시장' : 'not configured',
        },
        silver: {
          configured: hasConfiguredEnv('METALS_DEV_API_KEY'),
          provider: hasConfiguredEnv('METALS_DEV_API_KEY') ? 'Metals.Dev' : 'not configured',
        },
        domesticSilver: {
          configured: true,
          provider: '한국금거래소 Silver-3.75g',
        },
        news: {
          configured: true,
          provider: 'Google News 실시간 + 공식기관 + GDELT + 뉴스 API',
        },
      },
    });
    return;
  }

  if (url.pathname === '/api/news') {
    const page = Math.max(1, Number(url.searchParams.get('page') || 1));
    getNews(page).then((news) => {
      sendJson(res, {
        updatedAt: new Date().toISOString(),
        query: NEWS_QUERY,
        page,
        hasMore: news.provider !== 'sample' && news.items.length > 0,
        ...news,
      });
    });
    return;
  }

  if (url.pathname === '/api/news-stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });
    res.write(': connected\n\n');
    newsStreamClients.add(res);
    getLatestNewsSnapshot().then((news) => res.write(`data: ${JSON.stringify({ ...news, updatedAt: new Date().toISOString() })}\n\n`));
    req.on('close', () => newsStreamClients.delete(res));
    return;
  }

  if (url.pathname === '/api/metal-prices') {
    getMarketSnapshot().then((snapshot) => {
      sendJson(res, {
        endpoint: `${GOLD_API_BASE_URL}/:symbol/:currency/:date?`,
        ...snapshot,
      });
    }).catch((error) => {
      sendJson(res, { error: error.message }, 502);
    });
    return;
  }

  if (url.pathname === '/api/metal-prices/history') {
    const range = url.searchParams.get('range') || 'day';
    const kind = url.searchParams.get('kind') || 'gold';
    getMarketHistory(kind, range).then((history) => {
      sendJson(res, { updatedAt: new Date().toISOString(), ...history });
    }).catch((error) => {
      sendJson(res, { error: error.message, history: [] }, 502);
    });
    return;
  }

  if (url.pathname === '/api/domestic-gold') {
    const range = url.searchParams.get('range') || 'day';
    getDomesticGold(range).then((gold) => {
      sendJson(res, { provider: 'KRX 금시장', updatedAt: new Date().toISOString(), gold });
    }).catch((error) => {
      sendJson(res, { provider: 'KRX 금시장', error: error.message }, 503);
    });
    return;
  }

  if (url.pathname === '/api/indicators') {
    getIndicators().then((indicators) => {
      sendJson(res, {
        updatedAt: new Date().toISOString(),
        ...indicators,
      });
    });
    return;
  }

  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  const requestedPath = safePath === '/' ? '/index.html' : safePath;
  const filePath = path.join(publicDir, requestedPath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(res, filePath);
      return;
    }

    sendFile(res, path.join(publicDir, 'index.html'));
  });
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Gold Signal is running at http://localhost:${port}`);
  });
  const newsBroadcastTimer = setInterval(() => broadcastLatestNews().catch(() => {}), 30000);
  newsBroadcastTimer.unref();
}

module.exports = handleRequest;
