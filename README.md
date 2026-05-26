# 오현중학교 컴시간 시간표 대시보드

Cloudflare Pages + Pages Functions 구조입니다.

## 파일 구조

```txt
index.html
functions/
  api/
    timetable.js
    meal.js
README.md
```

## 동작 구조

- `/api/timetable?date=YYYY-MM-DD`: 컴시간 서버에서 오현중학교 시간표 JSON을 가져옵니다.
- `/api/meal?date=YYYY-MM-DD`: 나이스 급식식단정보 API에서 오현중학교 급식 메뉴를 가져옵니다.
- 공지사항은 서버가 아니라 현재 브라우저의 `localStorage`에 저장됩니다.
  - 같은 컴퓨터/같은 브라우저/같은 도메인에서만 유지됩니다.
  - 다른 학년 교무실 컴퓨터에서는 각각 다른 공지사항을 사용할 수 있습니다.

## Cloudflare Pages 설정

- Framework preset: None
- Build command: 비움
- Build output directory: `/`
- Root directory: 비움

## NEIS 인증키 설정

급식 메뉴를 불러오려면 Cloudflare Pages에 나이스 Open API 인증키를 환경변수로 넣어야 합니다.

Cloudflare에서 다음 경로로 이동하세요.

```txt
Workers & Pages
→ comci-timetable
→ Settings
→ Variables and Secrets
→ Add variable
```

다음처럼 추가합니다.

```txt
Variable name: NEIS_API_KEY
Value: 발급받은 나이스 Open API 인증키
Environment: Production
```

저장 후 반드시 다시 배포하세요.

```txt
Deployments
→ Retry deployment 또는 GitHub에 아무 수정 후 push
```

기존에 `NEIS_KEY`라는 이름으로 넣어둔 경우도 호환되지만, 권장 이름은 `NEIS_API_KEY`입니다.

## 테스트 주소

배포 후 아래 주소를 직접 열어 확인합니다.

```txt
https://도메인/api/meal?date=2026-05-27
```

정상이면 `ok: true`와 `menu` 배열이 표시됩니다.


## 급식 알레르기 표시

나이스 급식 원문 DDISH_NM의 괄호 안 알레르기 번호를 메뉴명 옆 배지로 표시합니다.
