# 오현중학교 컴시간 시간표

Cloudflare Pages + Pages Functions 구조입니다.

## 파일 구조

```txt
index.html
functions/
  api/
    timetable.js
```

## 동작 구조

```txt
브라우저
  ↓
/api/timetable?date=YYYY-MM-DD
  ↓
Cloudflare Pages Function
  ↓
http://comci.net:4082/36179
```

## 배포 방법

1. Cloudflare Pages 프로젝트를 만듭니다.
2. 이 폴더 전체를 GitHub 저장소에 올립니다.
3. Cloudflare Pages에서 해당 저장소를 연결합니다.
4. 빌드 설정은 비워두거나 다음처럼 둡니다.

```txt
Build command: 없음
Build output directory: /
```

5. 배포 후 아래 주소가 열리면 성공입니다.

```txt
https://도메인/api/timetable?date=2026-05-27
```

JSON이 보이면 `index.html`도 정상 작동합니다.

## 주의

컴시간 서버 구조가 바뀌면 `functions/api/timetable.js`의 요청 규칙을 다시 수정해야 합니다.
