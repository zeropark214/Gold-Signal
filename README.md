# Gold Signal

금 투자자를 위한 경제 지표, 뉴스 속보, 커뮤니티 앱 프로토타입입니다.

## 실행

이 프로젝트에는 로컬 Node.js가 `.local/node-v24.16.0-darwin-arm64` 경로에 설치되어 있습니다.

먼저 실제 API 키를 `.env`에 설정합니다. `.env`는 git에 올라가지 않습니다.

```bash
cp .env.example .env
```

`.env` 예시:

```text
PORT=3001
GOLD_API_KEY=your_goldapi_key
GOLD_API_SYMBOL=XAU
GOLD_API_CURRENCY=USD
FRED_API_KEY=your_fred_api_key
```

서버를 실행합니다.

```bash
PATH=.local/node-v24.16.0-darwin-arm64/bin:$PATH npm start
```

실행 후 브라우저에서 아래 주소를 엽니다.

```text
http://localhost:3001
```

실제 API 연결 상태는 아래에서 확인할 수 있습니다.

```text
http://localhost:3001/api/health
```

## 국제 금값 API

홈 화면의 국제 금값은 서버의 `/api/metal-prices`를 통해 가져옵니다.

실제 GoldAPI.io 데이터를 사용하려면 실행 전에 `GOLD_API_KEY`를 설정합니다. 키가 없으면 샘플 시세가 표시됩니다.

```bash
GOLD_API_KEY=your_goldapi_key PATH=.local/node-v24.16.0-darwin-arm64/bin:$PATH npm start
```

GoldAPI.io endpoint 형식은 아래와 같습니다.

```text
https://www.goldapi.io/api/:symbol/:currency/:date?
```

기본값은 `XAU/USD`이며, 필요하면 아래처럼 조정할 수 있습니다.

```bash
GOLD_API_KEY=your_goldapi_key GOLD_API_SYMBOL=XAU GOLD_API_CURRENCY=USD PORT=3001 .local/node-v24.16.0-darwin-arm64/bin/node index.js
```

## 경제 지표 API

지표 탭은 서버의 `/api/indicators`를 통해 데이터를 가져옵니다.

FRED 실제 데이터를 사용하려면 `FRED_API_KEY`를 설정합니다. 키가 없으면 샘플 지표가 표시됩니다.

```bash
FRED_API_KEY=your_fred_api_key PORT=3001 .local/node-v24.16.0-darwin-arm64/bin/node index.js
```

## 주요 화면

- 대시보드: 오늘의 금 시장 요약, 핵심 지표, 속보 뉴스, 인기 커뮤니티
- 경제 지표: 매일 봐야 할 지표와 매월 봐야 할 지표
- 뉴스: 미국 언론사 헤드라인 번역, 금값 영향 요인 태그, 푸시 알림 설정
- 커뮤니티: 금 투자 주제별 토론방, 투자자 배지, 공감, 신고

## 기획 문서

- `index.md/01-service-overview.md`
- `index.md/02-mvp-scope.md`
- `index.md/03-user-flow.md`
- `index.md/04-wireframes.md`
- `index.md/05-functional-spec.md`
- `index.md/06-ui-ux-rules.md`
