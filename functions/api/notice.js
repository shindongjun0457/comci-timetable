const ALLOWED_GRADES = new Set(["1", "2", "3"]);
const MAX_NOTICE_LENGTH = 2000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function getGrade(request) {
  const url = new URL(request.url);
  const grade = url.searchParams.get("grade") || "1";
  if (!ALLOWED_GRADES.has(grade)) return null;
  return grade;
}

function getNoticeKey(grade) {
  return `notice:grade:${grade}`;
}

export async function onRequestGet(context) {
  const grade = getGrade(context.request);
  if (!grade) return json({ ok: false, message: "grade는 1, 2, 3 중 하나여야 합니다." }, 400);

  if (!context.env.NOTICES) {
    return json({ ok: false, message: "Cloudflare KV 바인딩 NOTICES가 설정되지 않았습니다." }, 500);
  }

  const key = getNoticeKey(grade);
  const content = await context.env.NOTICES.get(key);

  return json({
    ok: true,
    grade,
    content: content || ""
  });
}

export async function onRequestPost(context) {
  const grade = getGrade(context.request);
  if (!grade) return json({ ok: false, message: "grade는 1, 2, 3 중 하나여야 합니다." }, 400);

  if (!context.env.NOTICES) {
    return json({ ok: false, message: "Cloudflare KV 바인딩 NOTICES가 설정되지 않았습니다." }, 500);
  }


  let body;
  try {
    body = await context.request.json();
  } catch (error) {
    return json({ ok: false, message: "JSON 본문을 해석하지 못했습니다." }, 400);
  }

  const content = String(body?.content || "").trim();

  if (content.length > MAX_NOTICE_LENGTH) {
    return json({ ok: false, message: `공지사항은 ${MAX_NOTICE_LENGTH}자 이내로 입력해 주세요.` }, 400);
  }

  const key = getNoticeKey(grade);
  await context.env.NOTICES.put(key, content);

  return json({
    ok: true,
    grade,
    content,
    updatedAt: new Date().toISOString()
  });
}
