// utils/refreshToken.ts
export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch("http://localhost:8080/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new Error("토큰 갱신 실패");

  return res.json();
}
