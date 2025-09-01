"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 (API 호출 등)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/"); // 로그인 성공 → 메인 페이지로 이동
    } else {
      console.log(res?.error);

      try {
        const errorObj = JSON.parse(res?.error ?? "{}");

        if (errorObj.detail) {
          addToast(errorObj.detail); // 기본 에러 토스트
        } else {
          addToast(res?.error ?? "{}");
        }
      } catch {
        addToast(res?.error ?? "{}");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9@._%+-]/g, "");
                setEmail(value);
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            로그인
          </button>
        </form>

        <div className="my-6 text-center text-sm text-gray-500">또는</div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center border py-2 rounded-md hover:bg-gray-100">
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
            Google 로 로그인
          </button>
          <button className="w-full flex items-center justify-center border py-2 rounded-md hover:bg-gray-100">
            <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5 mr-2" />
            Apple 로 로그인
          </button>
          <button className="w-full flex items-center justify-center border py-2 rounded-md hover:bg-gray-100">
            <img src="/kakao-icon.svg" alt="GitHub" className="w-5 h-5 mr-2" />
            Kakao 로 로그인
          </button>
        </div>

        <p className="mt-6 text-sm text-center text-gray-500">
          계정이 없으신가요?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
