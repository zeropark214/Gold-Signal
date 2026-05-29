const dailyIndicators = [
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
    points: [2372, 2366, 2368, 2359, 2351, 2346, 2342],
  },
  {
    name: '국제 은값',
    value: '$31.18',
    change: '+0.76%',
    trend: 'up',
    details: ['트로이온스', '런던 현물 기준'],
    points: [30.48, 30.62, 30.71, 30.86, 30.94, 31.02, 31.18],
  },
  {
    name: '국내 금값',
    value: '103,840원',
    change: '+0.31%',
    trend: 'up',
    details: ['g당', '국내 소매 기준'],
    points: [102980, 103120, 103040, 103320, 103510, 103620, 103840],
  },
  {
    name: '국내 은값',
    value: '1,382원',
    change: '+0.54%',
    trend: 'up',
    details: ['g당', '국내 소매 기준'],
    points: [1360, 1364, 1368, 1373, 1371, 1378, 1382],
  },
  {
    name: '김치프리미엄',
    value: '+2.8%',
    change: '+0.2%p',
    trend: 'up',
    details: ['국내-국제 환산가', '국내 금 기준'],
    points: [2.1, 2.2, 2.3, 2.1, 2.5, 2.6, 2.8],
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

const monthlyIndicators = [
  {
    name: 'PCE·근원 PCE',
    value: '2.8%',
    compare: '예상 2.7% / 이전 2.8%',
    change: '예상 상회',
    impact: 'down',
    summary: '연준이 선호하는 물가 지표가 예상보다 높으면 금리 인하 기대가 약해질 수 있습니다.',
    related: 'FOMC, 실질금리, 달러지수',
  },
  {
    name: 'CPI·근원 CPI',
    value: '3.4%',
    compare: '예상 3.3% / 이전 3.2%',
    change: '예상 상회',
    impact: 'down',
    summary: 'CPI가 예상보다 높으면 국채금리와 달러가 상승해 금값에 부담이 될 수 있습니다.',
    related: 'PCE, 국채금리, FedWatch',
  },
  {
    name: '고용보고서 NFP·실업률·임금',
    value: '+175K',
    compare: '예상 +190K / 실업률 3.9%',
    change: '고용 둔화',
    impact: 'up',
    summary: '고용 둔화는 금리 인하 기대와 안전자산 선호를 높일 수 있습니다.',
    related: '평균 시간당 임금, 실업률',
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
    name: 'ISM 제조업·서비스업',
    value: '49.2 / 51.4',
    compare: '기준선 50',
    change: '혼재',
    impact: 'neutral',
    summary: '제조업 위축과 서비스업 확장이 엇갈려 금값 영향은 다른 지표 확인이 필요합니다.',
    related: 'PMI, 고용, 가격지수',
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

const newsItems = [
  {
    title: 'Fed 인사, 금리 인하 신중론 언급',
    original: 'Fed official signals caution on rate cuts',
    source: 'Example US News',
    time: '5분 전',
    tags: ['금리', '달러', '국채금리'],
    priority: '속보',
    impactScore: 92,
    assets: ['국제 금', 'DXY', '10년물 금리'],
    comments: 28,
    highlights: ['금리 인하 기대 약화', '달러 강세 가능성', '단기 금값 부담'],
    summary: '연준 인사의 신중한 발언으로 금리 인하 기대가 낮아지며 달러와 국채금리가 상승할 가능성이 있습니다.',
    url: 'https://example.com/fed-rate-cuts',
  },
  {
    title: '달러지수 상승, 금 현물 가격 압박',
    original: 'Dollar climbs as Treasury yields rise',
    source: 'Market Wire',
    time: '18분 전',
    tags: ['달러', '미국 국채금리'],
    priority: '중요',
    impactScore: 84,
    assets: ['국제 금', '국내 금', '원/달러'],
    comments: 17,
    highlights: ['달러 강세', '국채금리 상승', '금 현물 압박'],
    summary: '달러 강세와 국채금리 상승이 동시에 나타나며 금 현물 가격에 단기 하락 압력이 커졌습니다.',
    url: 'https://example.com/dollar-gold',
  },
  {
    title: '중앙은행 금 매입, 3개월 연속 확대',
    original: 'Central banks extend gold buying streak',
    source: 'Global Finance Daily',
    time: '42분 전',
    tags: ['중앙은행 금 매입'],
    priority: '중요',
    impactScore: 78,
    assets: ['국제 금', '금 ETF'],
    comments: 11,
    highlights: ['중앙은행 매입 확대', '장기 수요 지지', '하방 완충 요인'],
    summary: '신흥국 중앙은행 중심의 금 매입 확대는 장기 수요를 지지하는 요인으로 해석됩니다.',
    url: 'https://example.com/central-bank-gold',
  },
  {
    title: '유가 반등에 인플레이션 기대 재점화',
    original: 'Oil rebound revives inflation concerns',
    source: 'Energy Desk',
    time: '1시간 전',
    tags: ['원자재', '인플레이션'],
    priority: '일반',
    impactScore: 63,
    assets: ['국제 금', '유가', 'CPI'],
    comments: 6,
    highlights: ['유가 반등', '물가 우려', 'PCE 확인 필요'],
    summary: '유가 상승은 향후 물가 지표와 기대인플레이션에 영향을 줄 수 있어 금 시장도 주시하고 있습니다.',
    url: 'https://example.com/oil-inflation',
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
    title: '오늘 CPI 이후 금 어떻게 보시나요?',
    body: 'CPI가 예상보다 높게 나오면 단기 조정 가능성을 보고 있습니다. 다만 ETF 흐름은 좋아 보여서 분할 접근이 나을까요?',
    room: '경제 지표 토론',
    author: 'gold_user',
    badge: '금 투자자',
    time: '방금 전',
    comments: 12,
    likes: 24,
    hot: 92,
  },
  {
    title: '금 ETF랑 실물 금 중 뭐가 나을까요?',
    body: '장기 보유 목적이면 ETF 수수료와 실물 보관 비용을 같이 봐야 할 것 같습니다.',
    room: '금 ETF',
    author: 'etf_user',
    badge: 'ETF 투자자',
    time: '15분 전',
    comments: 8,
    likes: 10,
    hot: 61,
  },
  {
    title: '실질금리 상승인데 중앙은행 매입은 계속 강하네요',
    body: '단기 가격과 장기 수급이 반대로 움직이는 구간이라 해석이 어렵습니다.',
    room: '실시간 시황',
    author: 'macro_watch',
    badge: '활발한 참여자',
    time: '34분 전',
    comments: 19,
    likes: 31,
    hot: 110,
  },
];

const state = {
  view: 'dashboard',
  indicatorGroup: 'daily',
  selectedIndicator: 0,
  newsFilter: '전체',
  selectedNews: 0,
  postSort: 'latest',
};

const views = {
  dashboard: document.querySelector('#dashboardView'),
  indicators: document.querySelector('#indicatorsView'),
  news: document.querySelector('#newsView'),
  community: document.querySelector('#communityView'),
};

const pageTitles = {
  dashboard: '대시보드',
  indicators: '경제 지표',
  news: '뉴스',
  community: '커뮤니티',
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

function setView(view) {
  state.view = view;
  document.querySelector('#pageTitle').textContent = pageTitles[view];
  Object.entries(views).forEach(([key, element]) => {
    element.classList.toggle('active', key === view);
  });
  document.querySelectorAll('.nav-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
  });
}

function renderIndicatorRows(container, indicators, compact = false) {
  container.innerHTML = indicators
    .map((item, index) => `
      <button class="indicator-row ${!compact && index === state.selectedIndicator ? 'active' : ''}" data-indicator-index="${index}" type="button">
        <span>
          <strong class="indicator-title">${index + 1}. ${item.name}</strong>
          <span class="meta">${item.value} · ${item.compare} · ${item.change}</span>
        </span>
        <span class="${impactClass(item.impact)}">${impactText(item.impact)}</span>
      </button>
    `)
    .join('');
}

function renderIndicatorDetail() {
  const indicators = state.indicatorGroup === 'daily' ? dailyIndicators : monthlyIndicators;
  const item = indicators[state.selectedIndicator] || indicators[0];
  document.querySelector('#indicatorDetail').innerHTML = `
    <span class="section-label">${state.indicatorGroup === 'daily' ? '매일 봐야 할 것' : '매월 봐야 할 것'} / 우선순위 ${state.selectedIndicator + 1}</span>
    <h3>${item.name}</h3>
    <div class="detail-metric">
      <div class="metric-box"><span>최신</span><strong>${item.value}</strong></div>
      <div class="metric-box"><span>비교</span><strong>${item.compare}</strong></div>
      <div class="metric-box"><span>변화</span><strong>${item.change}</strong></div>
    </div>
    <p>${item.summary}</p>
    <div class="news-tags">
      ${item.related.split(', ').map((tag) => `<span class="tag">${tag}</span>`).join('')}
    </div>
  `;
}

function renderIndicators() {
  const indicators = state.indicatorGroup === 'daily' ? dailyIndicators : monthlyIndicators;
  renderIndicatorRows(document.querySelector('#indicatorList'), indicators);
  renderIndicatorDetail();
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

function marketPriceTemplate(item) {
  return `
    <article class="home-index-row ${item.trend === 'up' ? 'trend-up' : 'trend-down'}">
      <div class="mini-chart">${sparkline(item.points)}</div>
      <div class="home-index-main">
        <strong>${item.name}</strong>
        <div>
          <span class="${item.trend === 'up' ? 'index-up' : 'index-down'}">${item.value}</span>
          <em class="${item.trend === 'up' ? 'index-up' : 'index-down'}">${item.change}</em>
        </div>
        <p>${item.details.map((detail) => `<span>${detail}</span>`).join('')}</p>
      </div>
    </article>
  `;
}

function renderMarketBoard() {
  document.querySelector('#marketBoard').innerHTML = marketPrices.map(marketPriceTemplate).join('');
}

function homeIndexTemplate(item) {
  return `
    <article class="home-index-row ${item.trend === 'up' ? 'trend-up' : 'trend-down'}">
      <div class="mini-chart">${sparkline(item.points)}</div>
      <div class="home-index-main">
        <strong>${item.name}</strong>
        <div>
          <span class="${item.trend === 'up' ? 'index-up' : 'index-down'}">${item.value}</span>
          <em class="${item.trend === 'up' ? 'index-up' : 'index-down'}">${item.change}</em>
        </div>
        <p>${item.details.map((detail) => `<span>${detail}</span>`).join('')}</p>
      </div>
    </article>
  `;
}

function renderHomeIndices() {
  document.querySelector('#homeIndexList').innerHTML = homeIndices.map(homeIndexTemplate).join('');
}

function renderDashboard() {
  renderMarketBoard();
  renderHomeIndices();
  document.querySelector('#dashboardNews').innerHTML = newsItems.slice(0, 3).map(newsTemplate).join('');
  document.querySelector('#dashboardPosts').innerHTML = posts.slice(0, 3).map(postTemplate).join('');
}

function newsTemplate(item, index = 0) {
  return `
    <button class="news-row ${index === state.selectedNews ? 'active' : ''}" data-news-index="${index}" type="button">
      <span class="news-title">${item.title}</span>
      <span class="meta">${item.source} · ${item.time}</span>
    </button>
  `;
}

function renderNews() {
  document.querySelector('#newsList').innerHTML = newsItems.map(newsTemplate).join('');
}

function postTemplate(item, index = 0) {
  return `
    <article class="post-row" data-post-index="${index}">
      <div>
        <span class="post-title">${item.title}</span>
        <span class="post-meta">작성자: ${item.author} <span class="badge">${item.badge}</span> · ${item.time}</span>
      </div>
      <p class="meta">${item.body}</p>
      <div class="post-actions">
        <button class="small-button" data-like-post="${index}" type="button">공감 ${item.likes}</button>
        <button class="small-button" data-comment-post="${index}" type="button">댓글 ${item.comments}</button>
        <button class="small-button" data-report-post="${index}" type="button">신고</button>
      </div>
    </article>
  `;
}

function visiblePosts() {
  return [...posts].sort((a, b) => {
    if (state.postSort === 'latest') return posts.indexOf(a) - posts.indexOf(b);
    return b.hot - a.hot;
  });
}

function renderPosts() {
  document.querySelector('#postList').innerHTML = visiblePosts().map(postTemplate).join('');
}

function renderAll() {
  renderDashboard();
  renderIndicators();
  renderNews();
  renderPosts();
}

document.querySelectorAll('.nav-button').forEach((button) => {
  button.addEventListener('click', () => setView(button.dataset.view));
});

document.querySelectorAll('[data-view-jump]').forEach((button) => {
  button.addEventListener('click', () => setView(button.dataset.viewJump));
});

document.querySelectorAll('[data-indicator-group]').forEach((button) => {
  button.addEventListener('click', () => {
    state.indicatorGroup = button.dataset.indicatorGroup;
    state.selectedIndicator = 0;
    document.querySelectorAll('[data-indicator-group]').forEach((item) => item.classList.toggle('active', item === button));
    renderIndicators();
  });
});

document.body.addEventListener('click', (event) => {
  const indicatorButton = event.target.closest('[data-indicator-index]');
  if (indicatorButton && state.view === 'indicators') {
    state.selectedIndicator = Number(indicatorButton.dataset.indicatorIndex);
    renderIndicators();
  }

  const newsButton = event.target.closest('[data-news-index]');
  if (newsButton && state.view === 'news') {
    showToast('뉴스 원문 연결은 실제 뉴스 피드 연동 단계에서 제공됩니다.');
  }

  const likeButton = event.target.closest('[data-like-post]');
  if (likeButton) {
    const post = visiblePosts()[Number(likeButton.dataset.likePost)];
    post.likes += 1;
    post.hot += 3;
    renderAll();
    showToast('공감이 반영되었습니다.');
  }

  const commentButton = event.target.closest('[data-comment-post]');
  if (commentButton) {
    showToast('댓글 기능은 다음 단계에서 상세 입력으로 확장합니다.');
  }

  const reportButton = event.target.closest('[data-report-post]');
  if (reportButton) {
    showToast('신고가 접수되었습니다. 운영 검토 대상에 추가됩니다.');
  }

});

document.querySelector('#pushToggle').addEventListener('change', (event) => {
  showToast(event.target.checked ? '중요 뉴스 푸시를 켰습니다.' : '중요 뉴스 푸시를 껐습니다.');
});

document.querySelectorAll('[data-post-sort]').forEach((button) => {
  button.addEventListener('click', () => {
    state.postSort = button.dataset.postSort;
    document.querySelectorAll('[data-post-sort]').forEach((item) => item.classList.toggle('active', item === button));
    renderPosts();
  });
});

function openPostModal() {
  document.querySelector('#postModal').showModal();
}

document.querySelector('#communityWriteButton').addEventListener('click', openPostModal);

document.querySelector('#postForm').addEventListener('submit', (event) => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault();

  const title = document.querySelector('#postTitle').value.trim();
  const body = document.querySelector('#postBody').value.trim();

  if (!title || !body) {
    showToast('제목과 본문을 입력해주세요.');
    return;
  }

  posts.unshift({
    title,
    body,
    room: '전체',
    author: 'gold_user',
    badge: '금 투자자',
    time: '방금 전',
    comments: 0,
    likes: 0,
    hot: 20,
  });

  document.querySelector('#postForm').reset();
  document.querySelector('#postModal').close();
  setView('community');
  renderAll();
  showToast('게시글이 등록되었습니다.');
});

renderAll();
