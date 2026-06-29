let dailyIndicators = [
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
];

const marketPrices = [
  {
    name: '국제 금값',
    value: '$2,342.80',
    change: '-0.42%',
    trend: 'down',
    details: ['트로이온스', '런던 현물 기준'],
    points: [2352.64, 2348.2, 2342.8],
    marketStats: {
      updatedAt: new Date().toISOString(),
      isFallback: true,
    },
  },
  {
    name: '국내 금값',
    value: '103,840원/g',
    change: '+0.31%',
    trend: 'up',
    details: ['KRX 금시장 기준', '1g당 가격'],
    points: [102980, 103120, 103040, 103320, 103510, 103620, 103840],
  },
  {
    name: '국내 금 가격 수준',
    value: '2.8% 비쌈',
    change: '+0.2%p',
    trend: 'up',
    details: ['국제 환산 가격보다 비쌉니다', '가격 차이 확대'],
    points: [2.1, 2.2, 2.3, 2.1, 2.5, 2.6, 2.8],
  },
  {
    name: '국제 은값',
    value: '$31.18',
    change: '+0.76%',
    trend: 'up',
    details: ['국제 은선물 기준', '트로이온스당'],
    points: [30.48, 30.62, 30.71, 30.86, 30.94, 31.02, 31.18],
  },
  {
    name: '국내 은값',
    value: '1,382원/g',
    change: '+0.54%',
    trend: 'up',
    details: ['국내 은 소매 기준', '1g당 가격'],
    points: [1360, 1364, 1368, 1373, 1371, 1378, 1382],
  },
  {
    name: '국내 은 가격 수준',
    value: '1.6% 비쌈',
    change: '-0.1%p',
    trend: 'down',
    details: ['국제 환산 가격보다 비쌉니다', '가격 차이 축소'],
    points: [2.0, 1.9, 1.8, 1.9, 1.7, 1.7, 1.6],
  },
];

const homeIndices = [
  {
    name: '미국 10년물 실질금리',
    value: '2.12%',
    change: '+0.09%p',
    trend: 'up',
    details: ['전일 2.03%', '금값 부담'],
    points: [1.96, 1.92, 1.98, 2.01, 2.04, 2.07, 2.12],
  },
  {
    name: '미국 10년물 국채금리',
    value: '4.37%',
    change: '+0.08%p',
    trend: 'up',
    details: ['전일 4.29%', '달러 강세 압력'],
    points: [4.21, 4.18, 4.22, 4.27, 4.31, 4.34, 4.37],
  },
  {
    name: '달러지수 DXY',
    value: '105.18',
    change: '+0.44%',
    trend: 'up',
    details: ['전일 104.72', '금값 부담'],
    points: [104.1, 104.3, 104.2, 104.6, 104.8, 105.0, 105.18],
  },
  {
    name: '원/달러 환율',
    value: '1,372.4원',
    change: '+0.48%',
    trend: 'up',
    details: ['전일 1,365.8원', '국내 금값 상승 압력'],
    points: [1358, 1361, 1360, 1365, 1368, 1370, 1372.4],
  },
  {
    name: '유가 WTI',
    value: '$78.60',
    change: '+0.90%',
    trend: 'up',
    details: ['전일 $77.90', '물가 기대 자극'],
    points: [76.9, 77.2, 77.0, 77.6, 78.0, 78.2, 78.6],
  },
  {
    name: '금 ETF 흐름',
    value: '+$286M',
    change: '순유입 확대',
    trend: 'up',
    details: ['전일 +$92M', '투자 수요 증가'],
    points: [42, 80, 55, 120, 166, 220, 286],
  },
];

let monthlyIndicators = [
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
];

let newsItems = [
  {
    id: 'fallback-fed-rate-cuts',
    titleKo: 'Fed 인사, 금리 인하 신중론 언급',
    titleOriginal: 'Fed official signals caution on rate cuts',
    source: 'Example US News',
    publishedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    tags: ['금리', '달러', '국채금리'],
    priority: '속보',
    impactScore: 92,
    relatedAssets: ['국제 금', 'DXY', '10년물 금리'],
    highlights: ['금리 인하 기대 약화', '달러 강세 가능성', '단기 금값 부담'],
    summaryKo: '연준 인사의 신중한 발언으로 금리 인하 기대가 낮아지며 달러와 국채금리가 상승할 가능성이 있습니다.',
    url: 'https://example.com/fed-rate-cuts',
    duplicateCount: 3,
  },
  {
    id: 'fallback-dollar-yields',
    titleKo: '달러지수 상승, 금 현물 가격 압박',
    titleOriginal: 'Dollar climbs as Treasury yields rise',
    source: 'Market Wire',
    publishedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    tags: ['달러', '미국 국채금리'],
    priority: '중요',
    impactScore: 84,
    relatedAssets: ['국제 금', '국내 금', '원/달러'],
    highlights: ['달러 강세', '국채금리 상승', '금 현물 압박'],
    summaryKo: '달러 강세와 국채금리 상승이 동시에 나타나며 금 현물 가격에 단기 하락 압력이 커졌습니다.',
    url: 'https://example.com/dollar-gold',
    duplicateCount: 2,
  },
  {
    id: 'fallback-central-bank-gold',
    titleKo: '중앙은행 금 매입, 3개월 연속 확대',
    titleOriginal: 'Central banks extend gold buying streak',
    source: 'Global Finance Daily',
    publishedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    tags: ['중앙은행 금 매입'],
    priority: '중요',
    impactScore: 78,
    relatedAssets: ['국제 금', '금 ETF'],
    highlights: ['중앙은행 매입 확대', '장기 수요 지지', '하방 완충 요인'],
    summaryKo: '신흥국 중앙은행 중심의 금 매입 확대는 장기 수요를 지지하는 요인으로 해석됩니다.',
    url: 'https://example.com/central-bank-gold',
    duplicateCount: 1,
  },
  {
    id: 'fallback-oil-inflation',
    titleKo: '유가 반등, 인플레이션 경로 재부각',
    titleOriginal: 'Oil rebound puts inflation path back in focus',
    source: 'Energy Desk',
    publishedAt: new Date(Date.now() - 72 * 60 * 1000).toISOString(),
    tags: ['유가', '인플레이션'],
    priority: '일반',
    impactScore: 63,
    relatedAssets: ['WTI', 'CPI', '국제 금'],
    highlights: ['유가 상승', '물가 경로 재부각', '연준 경계감'],
    summaryKo: '유가 상승은 향후 물가 지표와 기대인플레이션에 영향을 줄 수 있어 금 시장도 주시하고 있습니다.',
    url: 'https://example.com/oil-inflation',
    duplicateCount: 1,
  },
];

const rooms = [
  { name: '전체', count: 418 },
  { name: '실시간 시황', count: 128 },
  { name: '금 현물', count: 76 },
  { name: '금 ETF', count: 96 },
  { name: '금 선물', count: 42 },
  { name: '금 관련주', count: 53 },
  { name: '경제 지표 토론', count: 72 },
  { name: '뉴스 토론', count: 84 },
  { name: '질문', count: 39 },
  { name: '장기투자', count: 61 },
];

let posts = [
  {
    id: 1,
    title: '오늘 CPI 이후 금 어떻게 보시나요?',
    body: 'CPI가 예상보다 높게 나오면 단기 조정 가능성을 보고 있습니다. 다만 ETF 흐름은 좋아 보여서 분할 접근이 나을까요?',
    room: '경제 지표 토론',
    author: 'cpi_watch',
    badge: '경제 지표 관심',
    avatar: 'C',
    time: '방금 전',
    comments: 12,
    likes: 24,
    hot: 92,
    commentItems: [
      { author: 'macro_watch', time: '방금 전', body: '예상 상회면 단기 조정은 열어둬야 할 것 같습니다.' },
      { author: 'etf_user', time: '3분 전', body: '저는 ETF 흐름이 꺾이는지도 같이 보려고요.' },
    ],
  },
  {
    id: 2,
    title: '금 ETF랑 실물 금 중 뭐가 나을까요?',
    body: '장기 보유 목적이면 ETF 수수료와 실물 보관 비용을 같이 봐야 할 것 같습니다.',
    room: '금 ETF',
    author: 'etf_user',
    badge: 'ETF 투자자',
    avatar: 'E',
    time: '15분 전',
    comments: 8,
    likes: 10,
    hot: 61,
    commentItems: [
      { author: 'long_gold', time: '10분 전', body: '환금성은 ETF가 편하고, 실물은 보관 비용을 꼭 봐야 합니다.' },
    ],
  },
  {
    id: 3,
    title: '실질금리 상승인데 중앙은행 매입은 계속 강하네요',
    body: '단기 가격과 장기 수급이 반대로 움직이는 구간이라 해석이 어렵습니다.',
    room: '실시간 시황',
    author: 'macro_watch',
    badge: '활발한 참여자',
    avatar: 'M',
    time: '34분 전',
    comments: 19,
    likes: 31,
    hot: 110,
    commentItems: [
      { author: 'long_gold', time: '12분 전', body: '단기 매크로랑 장기 수급을 분리해서 보는 게 낫다고 봅니다.' },
      { author: 'macro_watch', time: '28분 전', body: '실질금리 둔화 신호가 나오면 반응이 빨라질 수 있어요.' },
    ],
  },
];

const currentUser = {
  isLoggedIn: true,
  nickname: 'gold_user',
  badge: '금 투자자',
  avatar: '金',
  avatarImage: '',
};

const state = {
  view: 'dashboard',
  newsFilter: '전체',
  selectedNews: 0,
  selectedNewsId: newsItems[0].id,
  postSort: 'latest',
  selectedRoom: '전체',
  expandedPostId: posts[0].id,
  likedPostIds: new Set(),
  selectedMarketIndex: 0,
  marketRange: 'day',
  indicatorType: 'daily',
  selectedIndicatorIndex: 0,
};

let indicatorMeta = {
  provider: 'sample',
  updatedAt: null,
};

const views = {
  dashboard: document.querySelector('#dashboardView'),
  marketDetail: document.querySelector('#marketDetailView'),
  indicators: document.querySelector('#indicatorsView'),
  indicatorDetail: document.querySelector('#indicatorDetailView'),
  news: document.querySelector('#newsView'),
  newsDetail: document.querySelector('#newsDetailView'),
  community: document.querySelector('#communityView'),
  profile: document.querySelector('#profileView'),
  profileEdit: document.querySelector('#profileEditView'),
};

const pageTitles = {
  dashboard: '대시보드',
  marketDetail: '시세 상세',
  indicators: '경제 지표',
  indicatorDetail: '지표 상세',
  news: '뉴스',
  newsDetail: '뉴스 상세',
  community: '커뮤니티',
  profile: '마이페이지',
  profileEdit: '프로필 편집',
};

function impactClass(impact) {
  if (impact === 'up') return 'impact-up';
  if (impact === 'down') return 'impact-down';
  return 'impact-neutral';
}

function impactText(impact) {
  if (impact === 'up') return '금값 우호';
  if (impact === 'down') return '금값 부담';
  return '중립';
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function avatarMarkup(label, image = '') {
  return image
    ? `<img src="${image}" alt="">`
    : label;
}

function renderAvatar(element, label, image = '') {
  element.innerHTML = avatarMarkup(label, image);
}

function setView(view) {
  state.view = view;
  document.querySelector('#pageTitle').textContent = pageTitles[view];
  document.querySelector('.app-shell').classList.toggle('depth-mode', ['marketDetail', 'indicatorDetail', 'newsDetail', 'profile', 'profileEdit'].includes(view));
  Object.entries(views).forEach(([key, element]) => {
    element.classList.toggle('active', key === view);
  });
  document.querySelectorAll('.nav-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
  });
}

function indicatorSchedule(type) {
  return type === 'daily' ? '매일 업데이트' : '다음 발표 일정 확인 중';
}

function renderIndicatorRows(container, indicators, type) {
  container.innerHTML = indicators
    .map((item, index) => {
      return `
      <button class="indicator-feed-row" data-indicator-index="${index}" data-indicator-group="${type}" type="button" aria-label="${item.name} 상세 보기">
        <div class="indicator-feed-main">
          <div class="indicator-compact-top">
            <strong>${item.name}</strong>
            <strong>${item.value}</strong>
          </div>
          <div class="indicator-compact-bottom">
            <span>${item.compare} · ${item.change}</span>
            <em class="indicator-impact-text tone-${item.impact}">${impactText(item.impact)}</em>
          </div>
        </div>
        <span class="indicator-link-arrow" aria-hidden="true">›</span>
      </button>
    `;
    })
    .join('');
}

function renderIndicators() {
  renderIndicatorRows(document.querySelector('#dailyIndicatorList'), dailyIndicators, 'daily');
  renderIndicatorRows(document.querySelector('#monthlyIndicatorList'), monthlyIndicators, 'monthly');

  const isDaily = state.indicatorType === 'daily';
  document.querySelector('#dailyIndicatorPanel').hidden = !isDaily;
  document.querySelector('#monthlyIndicatorPanel').hidden = isDaily;
  document.querySelectorAll('[data-indicator-type]').forEach((button) => {
    const isActive = button.dataset.indicatorType === state.indicatorType;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  const provider = indicatorMeta.provider === 'FRED' ? 'FRED' : '샘플 데이터';
  const updatedAt = indicatorMeta.updatedAt
    ? new Date(indicatorMeta.updatedAt).toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '업데이트 확인 중';
  document.querySelector('#indicatorDataMeta').textContent = `${provider} · ${updatedAt}`;
}

function renderIndicatorDetail() {
  const indicators = state.indicatorType === 'daily' ? dailyIndicators : monthlyIndicators;
  const item = indicators[state.selectedIndicatorIndex] || indicators[0];
  if (!item) return;

  document.querySelector('#indicatorDetailTitle').textContent = item.name;
  document.querySelector('#indicatorDetailContent').innerHTML = `
    <header class="indicator-detail-summary">
      <div>
        <span class="indicator-detail-kicker">현재 수치</span>
        <strong>${item.value}</strong>
      </div>
      <span class="${impactClass(item.impact)}">${impactText(item.impact)}</span>
    </header>
    <section class="indicator-explanation" aria-labelledby="indicatorExplanationTitle">
      <h3 id="indicatorExplanationTitle">금 가격에는 어떤 의미인가요?</h3>
      <p>${item.summary}</p>
    </section>
    <dl class="indicator-detail-metrics">
      <div><dt>현재</dt><dd>${item.value}</dd></div>
      <div><dt>비교</dt><dd>${item.compare}</dd></div>
      <div><dt>변화</dt><dd>${item.change}</dd></div>
    </dl>
    <section class="indicator-detail-info">
      <div><span>확인 주기</span><strong>${indicatorSchedule(state.indicatorType)}</strong></div>
      <div><span>관련 지표</span><strong>${item.related || '확인 중'}</strong></div>
      <div><span>데이터 출처</span><strong>${indicatorMeta.provider === 'FRED' ? 'FRED' : '샘플 데이터'}</strong></div>
    </section>
  `;
}

async function loadIndicators() {
  try {
    const response = await fetch('/api/indicators');
    if (!response.ok) throw new Error('지표 API 응답 실패');
    const data = await response.json();
    dailyIndicators = data.daily || dailyIndicators;
    monthlyIndicators = data.monthly || monthlyIndicators;
    indicatorMeta = {
      provider: data.provider || 'sample',
      updatedAt: data.updatedAt || null,
    };
    renderIndicators();
  } catch (error) {
    showToast('지표 API 연결 전이라 샘플 지표를 표시합니다.');
  }
}

function sparkline(points) {
  const width = 148;
  const height = 42;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1 || 1);
  const path = points
    .map((point, index) => {
      const x = index * step;
      const y = height - ((point - min) / range) * (height - 6) - 3;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return `
    <svg class="sparkline" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false">
      <path d="${path}" />
    </svg>
  `;
}

function marketPriceTemplate(item, marketIndex) {
  return `
    <button class="home-index-row market-price-link ${item.trend === 'up' ? 'trend-up' : 'trend-down'}" data-market-index="${marketIndex}" type="button" aria-label="${item.name} 상세 보기">
      <div class="home-index-main">
        <div class="market-row-heading">
          <strong>${item.name}</strong>
        </div>
        <div class="market-row-metric">
          <span class="${item.trend === 'up' ? 'index-up' : 'index-down'}">${item.value}</span>
          <em class="${item.trend === 'up' ? 'index-up' : 'index-down'}">${item.change}</em>
        </div>
        <p>${item.details.map((detail) => `<span>${detail}</span>`).join('')}</p>
      </div>
      <span class="market-link-arrow" aria-hidden="true">›</span>
    </button>
  `;
}

function goldTrendChart(item) {
  const points = item.points.slice(0, 3).map(Number);
  const chartWidth = 640;
  const chartHeight = 230;
  const plot = { left: 34, right: 604, top: 24, bottom: 174 };
  const minValue = Math.min(...points);
  const maxValue = Math.max(...points);
  const padding = Math.max((maxValue - minValue) * 0.24, maxValue * 0.0008, 1);
  const scaleMin = minValue - padding;
  const scaleMax = maxValue + padding;
  const xPositions = [plot.left, (plot.left + plot.right) / 2, plot.right];
  const yFor = (value) => plot.bottom - ((value - scaleMin) / (scaleMax - scaleMin)) * (plot.bottom - plot.top);
  const coordinates = points.map((point, index) => [xPositions[index], yFor(point)]);
  const path = coordinates.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const labels = ['전일 종가', '오늘 시가', '현재가'];
  const chartSummary = `${labels.map((label, index) => `${label} ${formatUsd(points[index])}`).join(', ')}.`;

  return `
    <figure class="gold-trend-figure ${item.trend === 'up' ? 'trend-up' : 'trend-down'}">
      <div class="gold-chart-heading">
        <strong>오늘의 가격 흐름</strong>
        <span>USD / 트로이온스</span>
      </div>
      <svg class="gold-trend-chart" viewBox="0 0 ${chartWidth} ${chartHeight}" role="img" aria-label="${chartSummary}">
        <line class="gold-chart-grid" x1="${plot.left}" y1="${plot.top}" x2="${plot.right}" y2="${plot.top}" />
        <line class="gold-chart-grid" x1="${plot.left}" y1="${(plot.top + plot.bottom) / 2}" x2="${plot.right}" y2="${(plot.top + plot.bottom) / 2}" />
        <line class="gold-chart-grid" x1="${plot.left}" y1="${plot.bottom}" x2="${plot.right}" y2="${plot.bottom}" />
        <path class="gold-trend-line" d="${path}" />
        ${coordinates.map(([x, y], index) => `
          <circle class="gold-trend-point ${index === 2 ? 'current' : ''}" cx="${x}" cy="${y}" r="${index === 2 ? 7 : 5}" />
          <text class="gold-point-value" x="${x}" y="${Math.max(17, y - 14)}" text-anchor="${index === 0 ? 'start' : index === 2 ? 'end' : 'middle'}">${formatUsd(points[index])}</text>
          <text class="gold-axis-label" x="${x}" y="208" text-anchor="${index === 0 ? 'start' : index === 2 ? 'end' : 'middle'}">${labels[index]}</text>
        `).join('')}
      </svg>
      <figcaption class="sr-only">${chartSummary}</figcaption>
    </figure>
  `;
}

function goldChangeText(item) {
  const amount = item.change.replace(/^[-+]/, '');
  if (item.trend === 'up') return `전일보다 ${amount} 올랐습니다`;
  if (item.trend === 'down') return `전일보다 ${amount} 내렸습니다`;
  return '전일과 같은 수준입니다';
}

function formatGoldUpdatedAt(item) {
  const updatedAt = item.marketStats?.updatedAt;
  if (!updatedAt) return '업데이트 시간 확인 중';
  return `${new Date(updatedAt).toLocaleString('ko-KR', {
    month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })} 업데이트`;
}

function renderGoldDetail(item) {
  document.querySelector('#goldDetailCard').innerHTML = `
    <section class="gold-detail" aria-label="국제 금값 요약">
      <button class="market-detail-hitarea" data-market-index="0" type="button" aria-label="국제 금값 상세 차트 보기"></button>
      <div class="gold-summary">
        <div class="gold-heading-stack">
          <div class="gold-title-row">
            <h4>${item.name}</h4>
            <span class="gold-data-status">${item.marketStats?.isFallback ? '샘플 데이터' : '실시간'}</span>
          </div>
          <p class="gold-unit">미국 달러 · 트로이온스당</p>
          <div class="gold-price-stack">
            <strong>${item.value}</strong>
            <p class="gold-change ${item.trend === 'up' ? 'is-up' : item.trend === 'down' ? 'is-down' : ''}">
              <span aria-hidden="true">${item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '―'}</span>
              ${goldChangeText(item)}
            </p>
          </div>
        </div>
        <p class="gold-updated-at">${formatGoldUpdatedAt(item)}</p>
      </div>
      ${goldTrendChart(item)}
    </section>
  `;
}

function renderMarketBoard() {
  const [goldPrice, domesticGold, goldPriceLevel, internationalSilver, domesticSilver, silverPriceLevel] = marketPrices;
  renderGoldDetail(goldPrice);
  document.querySelector('#marketBoard').innerHTML = `
    <section class="market-group" aria-labelledby="goldMarketGroupTitle">
      <div class="market-group-heading">
        <h3 id="goldMarketGroupTitle">우리나라 금 가격</h3>
        <p>국제 금값과 비교해 확인하세요</p>
      </div>
      ${marketPriceTemplate(domesticGold, 1)}
      ${marketPriceTemplate(goldPriceLevel, 2)}
    </section>
    <section class="market-group" aria-labelledby="silverMarketGroupTitle">
      <div class="market-group-heading">
        <h3 id="silverMarketGroupTitle">은 가격</h3>
        <p>국제 가격부터 국내 가격 수준까지</p>
      </div>
      ${marketPriceTemplate(internationalSilver, 3)}
      ${marketPriceTemplate(domesticSilver, 4)}
      ${marketPriceTemplate(silverPriceLevel, 5)}
    </section>
  `;
}

const marketRangeOptions = {
  day: { label: '일', count: 12, amplitude: 0.006, start: '09:00', middle: '13:00', end: '현재' },
  week: { label: '주', count: 14, amplitude: 0.018, start: '1주 전', middle: '3일 전', end: '오늘' },
  month: { label: '월', count: 24, amplitude: 0.045, start: '30일 전', middle: '15일 전', end: '오늘' },
  year: { label: '년', count: 36, amplitude: 0.14, start: '1년 전', middle: '6개월 전', end: '오늘' },
};

function marketNumericValue(item) {
  return Number(String(item.value).replace(/[^0-9.-]/g, '')) || 0;
}

function formatMarketValue(item, value) {
  if (item.name.includes('가격 수준')) return `${value.toFixed(1)}%`;
  if (item.value.includes('원')) return `${Math.round(value).toLocaleString('ko-KR')}원/g`;
  return formatUsd(value);
}

function marketHistory(item, range, marketIndex) {
  const config = marketRangeOptions[range];
  const current = marketNumericValue(item);
  const direction = item.trend === 'down' ? -1 : 1;
  const amplitude = item.name.includes('가격 수준') ? config.amplitude * 0.45 : config.amplitude;

  return Array.from({ length: config.count }, (_, index) => {
    if (index === config.count - 1) return current;
    const progress = index / (config.count - 1);
    const drift = direction * amplitude * (progress - 1) * 0.55;
    const wave = Math.sin((index + marketIndex * 1.7) * 1.25) * amplitude * 0.34;
    const secondaryWave = Math.cos((index + marketIndex) * 0.58) * amplitude * 0.18;
    return current * (1 + drift + wave + secondaryWave);
  });
}

function marketHistoryChart(item, range, marketIndex) {
  const values = marketHistory(item, range, marketIndex);
  const width = 700;
  const height = 330;
  const plot = { left: 24, right: 612, top: 30, bottom: 252 };
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const padding = Math.max((maximum - minimum) * 0.14, maximum * 0.001, 0.1);
  const scaleMin = minimum - padding;
  const scaleMax = maximum + padding;
  const xFor = (index) => plot.left + (index / (values.length - 1)) * (plot.right - plot.left);
  const yFor = (value) => plot.bottom - ((value - scaleMin) / (scaleMax - scaleMin)) * (plot.bottom - plot.top);
  const path = values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index).toFixed(1)} ${yFor(value).toFixed(1)}`).join(' ');
  const config = marketRangeOptions[range];
  const gridValues = [scaleMax, (scaleMax + scaleMin) / 2, scaleMin];
  const firstValue = values[0];
  const currentValue = values[values.length - 1];
  const changePercent = firstValue ? ((currentValue - firstValue) / firstValue) * 100 : 0;

  return {
    values,
    minimum,
    maximum,
    changePercent,
    markup: `
      <svg class="market-history-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${item.name} ${config.label}간 가격 추이">
        ${gridValues.map((value) => `
          <line class="market-history-grid" x1="${plot.left}" y1="${yFor(value)}" x2="${plot.right}" y2="${yFor(value)}" />
          <text class="market-history-y-label" x="680" y="${yFor(value) + 5}" text-anchor="end">${formatMarketValue(item, value)}</text>
        `).join('')}
        <path class="market-history-line" d="${path}" />
        <circle class="market-history-current" cx="${xFor(values.length - 1)}" cy="${yFor(currentValue)}" r="7" />
        <text class="market-history-current-label" x="${plot.right - 10}" y="${Math.max(20, yFor(currentValue) - 16)}" text-anchor="end">현재 ${formatMarketValue(item, currentValue)}</text>
        <text class="market-history-x-label" x="${plot.left}" y="300" text-anchor="start">${config.start}</text>
        <text class="market-history-x-label" x="${(plot.left + plot.right) / 2}" y="300" text-anchor="middle">${config.middle}</text>
        <text class="market-history-x-label" x="${plot.right}" y="300" text-anchor="end">${config.end}</text>
      </svg>
    `,
  };
}

function renderMarketDetail() {
  const item = marketPrices[state.selectedMarketIndex] || marketPrices[0];
  const chart = marketHistoryChart(item, state.marketRange, state.selectedMarketIndex);
  const changeDirection = chart.changePercent > 0 ? '올랐습니다' : chart.changePercent < 0 ? '내렸습니다' : '변동이 없습니다';
  const changeClass = chart.changePercent > 0 ? 'is-up' : chart.changePercent < 0 ? 'is-down' : '';

  document.querySelector('#marketDetailTitle').textContent = item.name;
  document.querySelector('#marketDetailContent').innerHTML = `
    <header class="market-detail-summary">
      <div>
        <span class="market-detail-kicker">현재 가격</span>
        <strong>${item.value}</strong>
        <p class="market-detail-change ${changeClass}">${marketRangeOptions[state.marketRange].label}간 ${Math.abs(chart.changePercent).toFixed(2)}% ${changeDirection}</p>
      </div>
      <span class="gold-data-status">샘플 시계열</span>
    </header>
    <div class="market-range-control" role="group" aria-label="차트 기간 선택">
      ${Object.entries(marketRangeOptions).map(([key, option]) => `
        <button class="${state.marketRange === key ? 'active' : ''}" data-market-range="${key}" type="button" aria-pressed="${state.marketRange === key}">${option.label}</button>
      `).join('')}
    </div>
    <section class="market-chart-panel" aria-label="${item.name} 가격 차트">
      ${chart.markup}
    </section>
    <dl class="market-detail-stats">
      <div><dt>기간 시작</dt><dd>${formatMarketValue(item, chart.values[0])}</dd></div>
      <div><dt>기간 최고</dt><dd>${formatMarketValue(item, chart.maximum)}</dd></div>
      <div><dt>기간 최저</dt><dd>${formatMarketValue(item, chart.minimum)}</dd></div>
      <div><dt>현재 가격</dt><dd>${item.value}</dd></div>
    </dl>
    <p class="market-detail-note">현재 기간별 차트는 샘플 데이터입니다. 실제 투자 판단에는 사용하지 마세요.</p>
  `;
}

function renderDashboard() {
  renderMarketBoard();
}

function formatUsd(value, digits = 2) {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

function normalizeGoldMarketPrice(gold) {
  const changePercent = Number(gold.changePercent || 0);
  const price = Number(gold.price || 0);
  const previousClose = Number(gold.previousClose || price);
  const trend = changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'neutral';

  return {
    name: '국제 금값',
    value: formatUsd(price),
    change: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
    trend,
    details: [
      gold.unit || '트로이온스',
      gold.source ? `${gold.source} 기준` : 'XAU/USD 기준',
      gold.isFallback ? '샘플 데이터' : '실시간',
    ],
    points: [previousClose, Number(gold.open || previousClose), price],
    marketStats: {
      open: gold.open,
      volume: gold.bid && gold.ask ? `${formatUsd(gold.bid)} / ${formatUsd(gold.ask)}` : '확인 중',
      low: gold.low,
      high: gold.high,
      previousClose: gold.previousClose,
      gram24k: gold.gram24k,
      updatedAt: gold.updatedAt,
      isFallback: gold.isFallback,
    },
  };
}

async function loadMetalPrices() {
  try {
    const response = await fetch('/api/metal-prices');
    if (!response.ok) throw new Error('금값 API 응답 실패');
    const data = await response.json();
    const goldPrice = normalizeGoldMarketPrice(data.gold);
    marketPrices[0] = goldPrice;
    renderMarketBoard();
  } catch (error) {
    showToast('국제 금값 API 연결 전이라 샘플 시세를 표시합니다.');
  }
}

function relativeTime(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

function normalizeNewsItem(item, index = 0) {
  return {
    id: item.id || `news-${index}`,
    titleKo: item.titleKo || item.title || item.titleOriginal,
    titleOriginal: item.titleOriginal || item.original || item.title,
    source: item.source || 'Unknown',
    publishedAt: item.publishedAt || new Date().toISOString(),
    url: item.url || '#',
    tags: item.tags || [],
    priority: item.priority || '일반',
    impactScore: Number(item.impactScore || 0),
    relatedAssets: item.relatedAssets || item.assets || [],
    highlights: item.highlights || [],
    summaryKo: item.summaryKo || item.summary || '요약이 준비 중입니다.',
    duplicateCount: item.duplicateCount || 1,
  };
}

function newsTemplate(item, index = 0) {
  return `
    <button class="news-row ${item.id === state.selectedNewsId ? 'active' : ''}" data-news-id="${item.id}" type="button">
      <span class="news-title">${item.titleKo}</span>
      <span class="meta">${item.source} · ${relativeTime(item.publishedAt)} · ${item.priority} · 영향 ${item.impactScore}</span>
    </button>
  `;
}

function renderNews() {
  document.querySelector('#newsList').innerHTML = newsItems.map(newsTemplate).join('');
}

function renderNewsDetail() {
  const item = newsItems.find((news) => news.id === state.selectedNewsId) || newsItems[0];
  if (!item) return;

  document.querySelector('#newsDetailPanel').innerHTML = `
    <div class="news-detail-stack">
      <div class="news-priority-row">
        <span class="tag">${item.priority}</span>
        <span class="meta">${item.source} · ${relativeTime(item.publishedAt)} · 영향 ${item.impactScore}</span>
      </div>
      <h3>${item.titleKo}</h3>
      <p class="news-original">${item.titleOriginal}</p>
      <p>${item.summaryKo}</p>
      <div class="news-tag-list">
        ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="news-detail-grid">
        <div>
          <span class="section-label">관련 자산</span>
          <strong>${item.relatedAssets.join(', ') || '확인 중'}</strong>
        </div>
        <div>
          <span class="section-label">중복 묶음</span>
          <strong>${item.duplicateCount}건</strong>
        </div>
      </div>
      <ul class="news-highlight-list">
        ${item.highlights.map((highlight) => `<li>${highlight}</li>`).join('')}
      </ul>
      <button class="secondary-button news-source-button" id="newsSourceButton" type="button">원문 보기</button>
    </div>
  `;
}

async function loadNews() {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) throw new Error('뉴스 API 응답 실패');
    const data = await response.json();
    newsItems = (data.items || []).map(normalizeNewsItem);
    state.selectedNewsId = newsItems[0]?.id || state.selectedNewsId;
  } catch (error) {
    newsItems = newsItems.map(normalizeNewsItem);
    showToast('뉴스 API 연결 전이라 샘플 뉴스를 표시합니다.');
  }

  renderNews();
}

function postTemplate(item, index = 0) {
  const isExpanded = state.expandedPostId === item.id;
  const isLiked = state.likedPostIds.has(item.id);
  return `
    <article class="post-row community-post ${isExpanded ? 'expanded' : ''}" data-post-id="${item.id}">
      <div class="community-post-header">
        <div class="post-avatar" aria-hidden="true">${avatarMarkup(item.avatar || 'G', item.avatarImage || '')}</div>
        <div>
          <span class="post-author">${item.author}</span>
          <span class="post-meta">${item.time} · ${item.room} <span class="badge">${item.badge}</span></span>
        </div>
      </div>
      <p class="community-post-text">${item.title}</p>
      ${isExpanded ? `<p class="meta">${item.body}</p>` : ''}
      <div class="post-actions community-actions">
        <button class="icon-action count-action ${isLiked ? 'active' : ''}" data-like-post="${item.id}" type="button" aria-label="공감 ${item.likes}"><span aria-hidden="true">♡</span><strong>${item.likes}</strong></button>
        <button class="icon-action count-action" data-comment-post="${item.id}" type="button" aria-label="댓글 ${item.comments}"><span aria-hidden="true">◯</span><strong>${item.comments}</strong></button>
        <button class="icon-action more-action" data-report-post="${item.id}" type="button" aria-label="더보기">…</button>
      </div>
      ${isExpanded ? `
        <div class="comment-panel">
          <div class="comment-list">
            ${item.commentItems.map((comment) => `
              <article class="comment-row">
                <span>${comment.author} · ${comment.time}</span>
                <p>${comment.body}</p>
                <button type="button" data-report-comment="${item.id}">신고</button>
              </article>
            `).join('')}
          </div>
          <form class="comment-form" data-comment-form="${item.id}">
            <input name="comment" type="text" placeholder="의견을 입력하세요" autocomplete="off">
            <button class="small-button" type="submit">등록</button>
          </form>
        </div>
      ` : ''}
    </article>
  `;
}

function postById(postId) {
  return posts.find((post) => post.id === Number(postId));
}

function requireCommunityProfile(actionName) {
  if (!currentUser.isLoggedIn) {
    showToast(`${actionName}하려면 회원가입 또는 로그인이 필요합니다.`);
    return false;
  }

  if (!currentUser.nickname) {
    showToast(`${actionName}하려면 닉네임 설정이 필요합니다.`);
    return false;
  }

  return true;
}

function visiblePosts() {
  return [...posts]
    .sort((a, b) => {
    if (state.postSort === 'latest') return posts.indexOf(a) - posts.indexOf(b);
    return b.hot - a.hot;
  });
}

function renderPostRoomOptions() {
  document.querySelector('#postRoom').innerHTML = rooms
    .filter((room) => room.name !== '전체')
    .map((room) => `<option value="${room.name}">${room.name}</option>`)
    .join('');
}

function renderPosts() {
  const nickname = document.querySelector('#communityNickname');
  if (nickname) nickname.textContent = currentUser.nickname || '닉네임 설정 필요';
  renderPostRoomOptions();
  document.querySelector('#sortMenuLabel').textContent = state.postSort === 'latest' ? '최신순' : '인기순';
  document.querySelector('#postList').innerHTML = visiblePosts().map(postTemplate).join('');
}

function activityTemplate(item) {
  return `
    <article class="activity-row">
      <span>${item.type} · ${item.time}</span>
      <strong>${item.title}</strong>
      <p>${item.body}</p>
    </article>
  `;
}

function renderProfile() {
  renderAvatar(document.querySelector('#profileAvatar'), currentUser.avatar, currentUser.avatarImage);
  document.querySelector('#profileNickname').textContent = currentUser.nickname;
  renderAvatar(document.querySelector('#composerAvatar'), currentUser.avatar, currentUser.avatarImage);
  renderAvatar(document.querySelector('#profileEditAvatarPreview'), currentUser.avatar, currentUser.avatarImage);
  document.querySelector('#profileAvatarInput').value = '';
  document.querySelector('#profileNicknameInput').value = currentUser.nickname;

  const myPosts = posts
    .flatMap((post, postIndex) => post.author === currentUser.nickname ? [{
      type: '게시글',
      time: post.time,
      order: postIndex,
      title: post.title,
      body: `${post.room} · 공감 ${post.likes} · 댓글 ${post.comments}`,
    }] : []);

  const myComments = posts
    .flatMap((post, postIndex) => post.commentItems
      .filter((comment) => comment.author === currentUser.nickname)
      .map((comment, commentIndex) => ({
        type: '댓글',
        time: comment.time,
        order: postIndex + ((commentIndex + 1) / 100),
        title: post.title,
        body: comment.body,
      })));

  const activities = [...myPosts, ...myComments]
    .sort((a, b) => a.order - b.order)
    .slice(0, 8);

  document.querySelector('#profileActivityArchive').innerHTML = activities.length
    ? activities.map(activityTemplate).join('')
    : '<p class="empty-state">아직 작성한 활동이 없습니다.</p>';
}

function renderAll() {
  renderDashboard();
  renderIndicators();
  newsItems = newsItems.map(normalizeNewsItem);
  renderNews();
  renderPosts();
  renderProfile();
}

document.querySelectorAll('.nav-button').forEach((button) => {
  button.addEventListener('click', () => setView(button.dataset.view));
});

document.querySelectorAll('[data-view-jump]').forEach((button) => {
  button.addEventListener('click', () => setView(button.dataset.viewJump));
});

document.body.addEventListener('click', (event) => {
  const marketButton = event.target.closest('[data-market-index]');
  if (marketButton) {
    state.selectedMarketIndex = Number(marketButton.dataset.marketIndex);
    state.marketRange = 'day';
    renderMarketDetail();
    setView('marketDetail');
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  const rangeButton = event.target.closest('[data-market-range]');
  if (rangeButton) {
    state.marketRange = rangeButton.dataset.marketRange;
    renderMarketDetail();
  }
});

document.querySelector('#marketDetailBackButton').addEventListener('click', () => {
  setView('dashboard');
});

document.body.addEventListener('click', (event) => {
  const typeButton = event.target.closest('[data-indicator-type]');
  if (typeButton) {
    state.indicatorType = typeButton.dataset.indicatorType;
    renderIndicators();
    return;
  }

  const indicatorButton = event.target.closest('[data-indicator-index]');
  if (indicatorButton) {
    state.indicatorType = indicatorButton.dataset.indicatorGroup;
    state.selectedIndicatorIndex = Number(indicatorButton.dataset.indicatorIndex);
    renderIndicatorDetail();
    setView('indicatorDetail');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
});

document.querySelector('#indicatorDetailBackButton').addEventListener('click', () => {
  renderIndicators();
  setView('indicators');
});

document.body.addEventListener('click', (event) => {
  const newsButton = event.target.closest('[data-news-id]');
  if (newsButton && state.view === 'news') {
    state.selectedNewsId = newsButton.dataset.newsId;
    renderNews();
    renderNewsDetail();
    setView('newsDetail');
  }

  const likeButton = event.target.closest('[data-like-post]');
  if (likeButton) {
    if (!requireCommunityProfile('공감')) return;
    const post = postById(likeButton.dataset.likePost);
    if (!post) return;
    const isLiked = state.likedPostIds.has(post.id);
    if (isLiked) {
      state.likedPostIds.delete(post.id);
      post.likes -= 1;
      post.hot -= 3;
    } else {
      state.likedPostIds.add(post.id);
      post.likes += 1;
      post.hot += 3;
    }
    renderPosts();
    showToast(isLiked ? '공감을 취소했습니다.' : '공감이 반영되었습니다.');
  }

  const postRow = event.target.closest('[data-post-id]');
  if (postRow && !event.target.closest('button, input, form')) {
    state.expandedPostId = Number(postRow.dataset.postId);
    renderPosts();
  }

  const commentButton = event.target.closest('[data-comment-post]');
  if (commentButton) {
    state.expandedPostId = Number(commentButton.dataset.commentPost);
    renderPosts();
    showToast('게시물 상세에서 댓글을 확인할 수 있습니다.');
  }

  const reportCommentButton = event.target.closest('[data-report-comment]');
  if (reportCommentButton) {
    showToast('댓글 신고가 접수되었습니다. 운영 검토 대상에 추가됩니다.');
  }

  const reportButton = event.target.closest('[data-report-post]');
  if (reportButton) {
    if (!requireCommunityProfile('신고')) return;
    showToast('신고가 접수되었습니다. 운영 검토 대상에 추가됩니다.');
  }

});

document.body.addEventListener('submit', (event) => {
  const commentForm = event.target.closest('[data-comment-form]');
  if (commentForm) {
    event.preventDefault();
    if (!requireCommunityProfile('댓글 작성')) return;
    const post = postById(commentForm.dataset.commentForm);
    const input = commentForm.elements.comment;
    const body = input.value.trim();

    if (!body) {
      showToast('댓글 내용을 입력해주세요.');
      return;
    }

    post.commentItems.push({
      author: currentUser.nickname,
      time: '방금 전',
      body,
    });
    post.comments += 1;
    post.hot += 3;
    input.value = '';
    renderPosts();
    renderProfile();
    showToast('댓글이 등록되었습니다.');
  }
});

document.querySelector('#pushToggle').addEventListener('change', (event) => {
  showToast(event.target.checked ? '중요 뉴스 푸시를 켰습니다.' : '중요 뉴스 푸시를 껐습니다.');
});

document.querySelector('#newsBackButton').addEventListener('click', () => {
  setView('news');
});

document.body.addEventListener('click', (event) => {
  const sourceButton = event.target.closest('#newsSourceButton');
  if (!sourceButton) return;
  const item = newsItems.find((news) => news.id === state.selectedNewsId);
  if (!item?.url || item.url === '#') {
    showToast('뉴스 원문을 열 수 없습니다.');
    return;
  }
  window.open(item.url, '_blank', 'noopener');
});

document.querySelector('#sortToggleButton').addEventListener('click', () => {
  state.postSort = state.postSort === 'latest' ? 'hot' : 'latest';
  state.expandedPostId = visiblePosts()[0]?.id || null;
  renderPosts();
  document.querySelector('#postList').scrollIntoView({ block: 'start' });
});

function openPostModal() {
  if (!requireCommunityProfile('새 글 작성')) return;
  const roomSelect = document.querySelector('#postRoom');
  const defaultRoom = state.selectedRoom === '전체' ? '실시간 시황' : state.selectedRoom;
  roomSelect.value = defaultRoom;
  document.querySelector('#postModal').showModal();
}

document.querySelector('#communityWriteButton').addEventListener('click', openPostModal);

document.querySelector('#profileButton').addEventListener('click', () => {
  renderProfile();
  setView('profile');
});

document.querySelector('#profileBackButton').addEventListener('click', () => {
  setView('community');
});

document.querySelector('#profileEditButton').addEventListener('click', () => {
  renderProfile();
  setView('profileEdit');
});

document.querySelector('#profileAvatarInput').addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (!file) {
    renderAvatar(document.querySelector('#profileEditAvatarPreview'), currentUser.avatar, currentUser.avatarImage);
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    document.querySelector('#profileEditAvatarPreview').innerHTML = `<img src="${reader.result}" alt="">`;
  });
  reader.readAsDataURL(file);
});

document.querySelector('#profileEditCancelButton').addEventListener('click', () => {
  renderProfile();
  setView('profile');
});

document.querySelector('#profileEditForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const previousNickname = currentUser.nickname;
  const nextNickname = document.querySelector('#profileNicknameInput').value.trim();
  const [avatarFile] = document.querySelector('#profileAvatarInput').files;

  if (!nextNickname) {
    showToast('닉네임을 입력해주세요.');
    return;
  }

  const saveProfile = (avatarImage = currentUser.avatarImage) => {
    currentUser.avatarImage = avatarImage;
    currentUser.nickname = nextNickname;

    posts.forEach((post) => {
      if (post.author === previousNickname) {
        post.author = nextNickname;
        post.avatar = currentUser.avatar;
        post.avatarImage = avatarImage;
      }

      post.commentItems.forEach((comment) => {
        if (comment.author === previousNickname) comment.author = nextNickname;
      });
    });

    renderPosts();
    renderProfile();
    setView('profile');
    showToast('프로필이 저장되었습니다.');
  };

  if (avatarFile) {
    const reader = new FileReader();
    reader.addEventListener('load', () => saveProfile(reader.result));
    reader.readAsDataURL(avatarFile);
    return;
  }

  saveProfile();
});

document.querySelector('#postForm').addEventListener('submit', (event) => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault();

  const title = document.querySelector('#postTitle').value.trim();
  const body = document.querySelector('#postBody').value.trim();
  const room = document.querySelector('#postRoom').value;

  if (!title || !body) {
    showToast('제목과 본문을 입력해주세요.');
    return;
  }

  posts.unshift({
    id: Date.now(),
    title,
    body,
    room,
    author: currentUser.nickname,
    badge: currentUser.badge,
    avatar: currentUser.avatar,
    avatarImage: currentUser.avatarImage,
    time: '방금 전',
    comments: 0,
    likes: 0,
    hot: 20,
    commentItems: [],
  });

  document.querySelector('#postForm').reset();
  document.querySelector('#postModal').close();
  setView('community');
  state.postSort = 'latest';
  state.expandedPostId = posts[0].id;
  renderPosts();
  renderProfile();
  showToast('게시글이 등록되었습니다.');
});

renderAll();
loadIndicators();
loadMetalPrices();
loadNews();
