# 핵심 경제 지표 확인

## 목적

금값에 영향을 주는 핵심 경제 지표를 사용자가 빠르게 확인할 수 있도록 구성한다.

## 주요 범위

- 국제 금값 실시간 시세
- 매일 봐야 할 지표
- 매월 봐야 할 지표
- 지표별 최신값, 이전값, 예상치 표시
- 금값 영향 요약
- 지표 상세 화면

## 국제 금값 API 연동

- 홈 화면의 `국제 금값`은 서버의 `/api/metal-prices` 응답을 사용한다.
- 서버는 `GOLD_API_KEY` 환경변수가 있으면 GoldAPI.io의 `https://www.goldapi.io/api/:symbol/:currency/:date?` 형식으로 시세를 호출한다.
- 기본 호출값은 `GOLD_API_SYMBOL=XAU`, `GOLD_API_CURRENCY=USD`이며, `GOLD_API_DATE`를 지정하면 과거 일자 조회로 확장할 수 있다.
- API 키가 없거나 외부 API 호출에 실패하면 샘플 시세를 반환해 화면이 깨지지 않게 한다.
- 프론트는 외부 API 키를 직접 보유하지 않고, 서버가 정규화한 값만 사용한다.
- 기준 단위는 `USD / 트로이온스`이며, 응답에 포함되는 g당 24K 가격은 보조 지표로 사용한다.

### `/api/metal-prices` 응답 예시

```json
{
  "updatedAt": "2026-06-04T00:00:00.000Z",
  "provider": "GoldAPI.io",
  "gold": {
    "symbol": "XAU/USD",
    "name": "국제 금값",
    "price": 2342.8,
    "change": -9.84,
    "changePercent": -0.42,
    "bid": 2342.2,
    "ask": 2343.1,
    "open": 2352.7,
    "high": 2361.4,
    "low": 2338.2,
    "previousClose": 2352.64,
    "gram24k": 75.32,
    "unit": "트로이온스",
    "currency": "USD",
    "source": "GoldAPI.io",
    "updatedAt": "2026-06-04T00:00:00.000Z",
    "isFallback": false
  }
}
```

## 지표 API 연동

- 지표 탭은 서버의 `/api/indicators` 응답을 사용한다.
- 서버는 `FRED_API_KEY` 환경변수가 있으면 FRED API에서 주요 경제지표를 조회한다.
- `FRED_API_KEY`가 없거나 FRED 호출에 실패하면 샘플 지표를 반환해 화면이 깨지지 않게 한다.
- FRED로 커버되지 않는 `금 ETF 흐름`, `중앙은행 금 매입`은 2차 연동 대상으로 두고 샘플 또는 별도 소스 값을 사용한다.

### 1차 연동 대상

| 화면 지표 | 연동 데이터 | FRED series |
| --- | --- | --- |
| 미국 10년물 실질금리 | 10Y TIPS 실질금리 | `DFII10` |
| 미국 10년물 국채금리 | 10Y Treasury yield | `DGS10` |
| 미국 GDP 대비 부채 비율 | Federal debt as percent of GDP | `GFDEGDQ188S` |
| 달러지수 DXY | Broad dollar index 대체값 | `DTWEXBGS` |
| 원/달러 환율 | USD/KRW | `DEXKOUS` |
| 유가 | WTI spot price | `DCOILWTICO` |
| PCE | PCE price index | `PCEPI` |
| 근원 PCE | Core PCE | `PCEPILFE` |
| CPI | CPI-U | `CPIAUCSL` |
| 근원 CPI | Core CPI | `CPILFESL` |
| 고용보고서 | Nonfarm payrolls | `PAYEMS` |
| 실업률 | Unemployment rate | `UNRATE` |
| 임금 | Average hourly earnings | `CES0500000003` |
| 소매판매 | Advance retail sales | `RSAFS` |
| GDP | Real GDP growth | `A191RL1Q225SBEA` |

### 2차 연동 대상

| 화면 지표 | 추천 소스 | 비고 |
| --- | --- | --- |
| 금 ETF 흐름 | World Gold Council, ETF.com, 유료 ETF 데이터 | 글로벌 금 ETF 순유입/순유출은 전용 소스 필요 |
| 중앙은행 금 매입 | World Gold Council, IMF IFS | 월간/분기 데이터 중심 |

### `/api/indicators` 응답 예시

```json
{
  "updatedAt": "2026-06-04T00:00:00.000Z",
  "provider": "FRED",
  "daily": [
    {
      "name": "미국 10년물 실질금리",
      "value": "2.12%",
      "compare": "전일 2.03%",
      "change": "+0.09%p",
      "impact": "down",
      "summary": "실질금리가 상승하면 금을 보유하는 기회비용이 커질 수 있습니다.",
      "related": "10년물 국채금리, 기대인플레이션, 달러지수"
    }
  ],
  "monthly": []
}
```

## 기준 문서

- `index.md/02-mvp-scope.md`
- `index.md/04-wireframes.md`
- `index.md/05-functional-spec.md`
