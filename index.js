const http = require('http');
const fs = require('fs');
const path = require('path');

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
const FRED_API_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything';
const GNEWS_API_BASE_URL = 'https://gnews.io/api/v4/search';
const NEWS_QUERY = process.env.NEWS_QUERY || '(gold OR bullion OR "Federal Reserve" OR FOMC OR Powell OR "Kevin Warsh" OR "interest rates" OR "rate cut" OR PCE OR CPI OR inflation OR "Treasury yields" OR "US dollar" OR "dollar index" OR DXY OR Trump OR tariff OR sanctions OR Iran OR Israel OR Gaza OR "Middle East")';
const NEWS_PAGE_SIZE = Number(process.env.NEWS_PAGE_SIZE || 10);
const NEWS_MIN_SCORE = Number(process.env.NEWS_MIN_SCORE || 60);

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
      name: '금 ETF 흐름',
      value: '+$286M',
      compare: '전일 +$92M',
      change: '순유입 확대',
      impact: 'up',
      summary: 'ETF 순유입은 투자 수요가 늘고 있음을 보여주는 중기 우호 신호입니다.',
      related: 'GLD, IAU, 글로벌 ETF 보유량',
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
    id: `${provider}-${index}-${Buffer.from(title).toString('base64url').slice(0, 12)}`,
    titleKo: title,
    titleOriginal: title,
    source: sourceName || provider,
    publishedAt,
    url: article.url || '#',
    tags: signal.tags.length ? signal.tags : ['금 시장'],
    priority: signal.score >= 82 ? '속보' : signal.score >= 68 ? '중요' : '일반',
    impactScore: signal.score,
    relatedAssets: signal.assets,
    highlights: signal.highlights.length ? signal.highlights : ['금값 영향 요인 확인 필요'],
    summaryKo: description,
    clusterKey: `${provider}-${sourceName || 'source'}-${index}`,
    duplicateCount: 1,
  };
}

function relevantNewsItems(articles, provider) {
  return articles
    .map((article, index) => normalizeNewsArticle(article, index, provider))
    .filter((item) => item.impactScore >= NEWS_MIN_SCORE)
    .slice(0, NEWS_PAGE_SIZE);
}

async function getNewsFromNewsApi() {
  const params = new URLSearchParams({
    q: NEWS_QUERY,
    searchIn: 'title,description',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: String(Math.min(Math.max(NEWS_PAGE_SIZE * 4, 20), 100)),
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
    items: relevantNewsItems(data.articles || [], 'newsapi'),
  };
}

async function getNewsFromGNews() {
  const params = new URLSearchParams({
    q: NEWS_QUERY,
    lang: 'en',
    country: 'us',
    max: String(Math.min(Math.max(NEWS_PAGE_SIZE, 1), 10)),
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
    items: relevantNewsItems(data.articles || [], 'gnews'),
  };
}

async function getNews() {
  try {
    const news = hasConfiguredEnv('NEWS_API_KEY')
      ? await getNewsFromNewsApi()
      : hasConfiguredEnv('GNEWS_API_KEY')
        ? await getNewsFromGNews()
        : null;

    if (news) {
      return news.items.length ? news : {
        provider: news.provider,
        error: 'No relevant gold market news found for the current query',
        items: newsFeed,
      };
    }

    return {
      provider: 'sample',
      items: newsFeed,
    };
  } catch (error) {
    return {
      provider: 'sample',
      error: error.message,
      items: newsFeed,
    };
  }
}

async function getGoldPrice() {
  if (!hasConfiguredEnv('GOLD_API_KEY')) {
    return fallbackGoldPrice;
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
  };
}

async function getIndicators() {
  if (!hasConfiguredEnv('FRED_API_KEY')) {
    return {
      provider: 'sample',
      ...fallbackIndicators,
    };
  }

  try {
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
    ] = await Promise.all([
      getFredSeries('DFII10'),
      getFredSeries('DGS10'),
      getFredSeries('GFDEGDQ188S', 3),
      getFredSeries('DTWEXBGS'),
      getFredSeries('DEXKOUS'),
      getFredSeries('DCOILWTICO'),
      getFredSeries('PCEPI', 16),
      getFredSeries('PCEPILFE', 16),
      getFredSeries('CPIAUCSL', 16),
      getFredSeries('CPILFESL', 16),
      getFredSeries('PAYEMS', 3),
      getFredSeries('UNRATE', 3),
      getFredSeries('CES0500000003', 3),
      getFredSeries('RSAFS', 3),
      getFredSeries('A191RL1Q225SBEA', 3),
    ]);

    const payrollDelta = payrolls[0].value - payrolls[1].value;
    const unemploymentDelta = unemployment[0].value - unemployment[1].value;
    const wageDelta = wages[0].value - wages[1].value;
    const retailDelta = pctChange(retailSales[0].value, retailSales[1].value);
    const gdpDelta = gdp[0].value - gdp[1].value;

    return {
      provider: 'FRED',
      daily: [
        dailyRateIndicator('미국 10년물 실질금리', realYield, 'higherHurtsGold', fallbackIndicators.daily[0].summary, fallbackIndicators.daily[0].related),
        dailyRateIndicator('미국 10년물 국채금리', treasury10y, 'higherHurtsGold', fallbackIndicators.daily[1].summary, fallbackIndicators.daily[1].related),
        periodRateIndicator('미국 GDP 대비 부채 비율', debtToGdp, 'higherSupportsGold', fallbackIndicators.daily[2].summary, fallbackIndicators.daily[2].related),
        dailyValueIndicator('달러지수 DXY', dollarIndex, 'higherHurtsGold', (value) => value.toFixed(2), fallbackIndicators.daily[3].summary, fallbackIndicators.daily[3].related),
        dailyValueIndicator('원/달러 환율', krw, 'higherSupportsGold', (value) => `${value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}원`, fallbackIndicators.daily[4].summary, fallbackIndicators.daily[4].related),
        dailyValueIndicator('유가', wti, 'higherSupportsGold', (value) => `$${value.toFixed(2)}`, fallbackIndicators.daily[5].summary, fallbackIndicators.daily[5].related),
        fallbackIndicators.daily[6],
      ],
      monthly: [
        monthlyYoyIndicator('PCE', pce, fallbackIndicators.monthly[0].summary, fallbackIndicators.monthly[0].related),
        monthlyYoyIndicator('근원 PCE', corePce, fallbackIndicators.monthly[1].summary, fallbackIndicators.monthly[1].related),
        monthlyYoyIndicator('CPI', cpi, fallbackIndicators.monthly[2].summary, fallbackIndicators.monthly[2].related),
        monthlyYoyIndicator('근원 CPI', coreCpi, fallbackIndicators.monthly[3].summary, fallbackIndicators.monthly[3].related),
        {
          name: '고용보고서',
          value: `${payrollDelta >= 0 ? '+' : ''}${Math.round(payrollDelta)}K`,
          compare: `이전 ${Math.round(payrolls[1].value - payrolls[2].value)}K`,
          change: payrollDelta >= 0 ? '고용 증가' : '고용 둔화',
          impact: payrollDelta < 0 ? 'up' : 'down',
          summary: fallbackIndicators.monthly[4].summary,
          related: fallbackIndicators.monthly[4].related,
        },
        {
          name: '실업률',
          value: `${unemployment[0].value.toFixed(1)}%`,
          compare: `이전 ${unemployment[1].value.toFixed(1)}%`,
          change: unemploymentDelta >= 0 ? '실업률 상승' : '실업률 하락',
          impact: unemploymentDelta >= 0 ? 'up' : 'down',
          summary: fallbackIndicators.monthly[5].summary,
          related: fallbackIndicators.monthly[5].related,
        },
        {
          name: '임금',
          value: formatPercent(pctChange(wages[0].value, wages[1].value)),
          compare: `이전 ${wages[1].value.toFixed(2)}`,
          change: wageDelta >= 0 ? '임금 상승' : '임금 둔화',
          impact: wageDelta >= 0 ? 'down' : 'up',
          summary: fallbackIndicators.monthly[6].summary,
          related: fallbackIndicators.monthly[6].related,
        },
        {
          name: '소매판매',
          value: formatPercent(retailDelta),
          compare: `전월 ${retailSales[1].value.toLocaleString('en-US')}`,
          change: retailDelta >= 0 ? '소비 증가' : '소비 둔화',
          impact: retailDelta >= 0 ? 'down' : 'up',
          summary: fallbackIndicators.monthly[7].summary,
          related: fallbackIndicators.monthly[7].related,
        },
        {
          name: 'GDP',
          value: `${gdp[0].value.toFixed(1)}%`,
          compare: `이전 ${gdp[1].value.toFixed(1)}%`,
          change: gdpDelta >= 0 ? '성장 확대' : '성장 둔화',
          impact: gdpDelta >= 0 ? 'down' : 'up',
          summary: fallbackIndicators.monthly[8].summary,
          related: fallbackIndicators.monthly[8].related,
        },
        fallbackIndicators.monthly[9],
      ],
    };
  } catch (error) {
    return {
      provider: 'sample',
      error: error.message,
      ...fallbackIndicators,
    };
  }
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
          configured: hasConfiguredEnv('GOLD_API_KEY'),
          provider: hasConfiguredEnv('GOLD_API_KEY') ? 'GoldAPI.io' : 'sample',
          symbol: `${GOLD_API_SYMBOL}/${GOLD_API_CURRENCY}`,
        },
        fred: {
          configured: hasConfiguredEnv('FRED_API_KEY'),
          provider: hasConfiguredEnv('FRED_API_KEY') ? 'FRED' : 'sample',
        },
        news: {
          configured: hasConfiguredEnv('NEWS_API_KEY') || hasConfiguredEnv('GNEWS_API_KEY'),
          provider: hasConfiguredEnv('NEWS_API_KEY') ? 'NewsAPI.org' : hasConfiguredEnv('GNEWS_API_KEY') ? 'GNews' : 'sample',
        },
      },
    });
    return;
  }

  if (url.pathname === '/api/news') {
    getNews().then((news) => {
      sendJson(res, {
        updatedAt: new Date().toISOString(),
        query: NEWS_QUERY,
        ...news,
      });
    });
    return;
  }

  if (url.pathname === '/api/metal-prices') {
    getGoldPrice().then((gold) => {
      sendJson(res, {
        updatedAt: new Date().toISOString(),
        provider: hasConfiguredEnv('GOLD_API_KEY') ? 'GoldAPI.io' : 'sample',
        endpoint: `${GOLD_API_BASE_URL}/:symbol/:currency/:date?`,
        gold,
      });
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
}

module.exports = handleRequest;
