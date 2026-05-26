# 오현중학교 컴시간 시간표 대시보드

Cloudflare Pages + Pages Functions 구조입니다.

## 파일 구조

```txt
index.html
functions/
  api/
    timetable.js
    meal.js
    notice.js
README.md
```

## API 구조

- `/api/timetable?date=YYYY-MM-DD`: 컴시간 서버에서 오현중학교 시간표 JSON을 가져옵니다.
- `/api/meal?date=YYYY-MM-DD`: 나이스 급식식단정보 API에서 오현중학교 급식 메뉴를 가져옵니다.
- `/api/notice?grade=1`: Cloudflare KV에서 학년별 공지사항을 가져오거나 저장합니다.

공지사항은 이제 `localStorage`가 아니라 Cloudflare KV에 학년별로 저장됩니다.

```txt
notice:grade:1
notice:grade:2
notice:grade:3
```

## Cloudflare Pages 설정

- Framework preset: None
- Build command: 비움
- Build output directory: `/`
- Root directory: 비움

## NEIS 인증키 설정

급식 메뉴를 불러오려면 Cloudflare Pages에 나이스 Open API 인증키를 Secret으로 넣어야 합니다.

```txt
Workers & Pages
→ comci-timetable
→ Settings
→ Variables and Secrets
→ Add variable
```

```txt
Variable name: NEIS_API_KEY
Type: Secret
Value: 발급받은 나이스 Open API 인증키
Environment: Production
```

## 공지사항 KV 설정

Cloudflare에서 KV 저장소를 하나 만듭니다.

```txt
Workers & Pages
→ KV
→ Create namespace
```

추천 이름:

```txt
ohyun_timetable_notices
```

그다음 Pages 프로젝트에 KV를 연결합니다.

```txt
Workers & Pages
→ comci-timetable
→ Settings
→ Functions
→ KV namespace bindings
→ Add binding
```

다음처럼 설정합니다.

```txt
Variable name: NOTICES
KV namespace: ohyun_timetable_notices
Environment: Production
```

`Variable name`은 반드시 `NOTICES`로 해야 합니다.

## 공지사항 저장 비밀번호 설정

공지사항 저장/비우기를 아무나 하지 못하게 하려면 Secret을 하나 더 추가합니다.

```txt
Workers & Pages
→ comci-timetable
→ Settings
→ Variables and Secrets
→ Add variable
```

```txt
Variable name: NOTICE_ADMIN_KEY
Type: Secret
Value: 원하는 저장 비밀번호
Environment: Production
```

이 값을 설정하면 화면에서 공지사항을 저장할 때 비밀번호 입력창이 뜹니다.

## 다시 배포

환경변수나 KV 바인딩을 추가한 뒤에는 다시 배포해야 합니다.

```txt
Deployments
→ 최신 배포 오른쪽 ···
→ Retry deployment 또는 Redeploy
```

또는 GitHub에 파일을 다시 commit하면 자동 배포됩니다.

## 테스트 주소

배포 후 아래 주소를 직접 열어 확인합니다.

```txt
https://도메인/api/meal?date=2026-05-27
https://도메인/api/notice?grade=1
```

공지사항 API가 정상이라면 다음처럼 나옵니다.

```json
{"ok":true,"grade":"1","content":""}
```

## v21 변경

- 공지사항 저장 방식을 브라우저 localStorage에서 Cloudflare KV로 변경했습니다.
- 공지사항을 1학년, 2학년, 3학년별로 웹에 저장합니다.
- 저장/비우기는 비밀번호 없이 바로 처리됩니다.
- 공지사항 수정 입력창의 예시 문구를 삭제했습니다.
