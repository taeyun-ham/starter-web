// 💡 전역 에러 처리용 ToastContext 및 ToastProvider 구현
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useEffect,
} from "react";

// 토스트 타입 정의
interface Toast {
  id: number;
  message: string;
  type?: "error" | "success" | "info";
}

interface ToastContextProps {
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = (message: string, type: Toast["type"] = "error") => {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastList />
    </ToastContext.Provider>
  );
};

const ToastList = () => {
  const context = useContext(ToastContext);
  if (!context) return null;

  const { toasts, removeToast } = context;

  return (
    <div className="fixed top-6 right-6 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex justify-between items-center gap-4 rounded px-4 py-2 shadow text-white text-sm transition-opacity duration-200
            ${
              toast.type === "error"
                ? "bg-red-700"
                : toast.type === "success"
                ? "bg-green-600"
                : "bg-blue-600"
            }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white hover:text-gray-200 focus:outline-none cursor-pointer"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("❌ useToast must be used within a <ToastProvider>");
  }
  return context;
};

// ✅ 사용 예시 컴포넌트 (삭제 가능)
// import { useToast } from './ToastProvider'
// const TestButton = () => {
//   const { addToast } = useToast()
//   return (
//     <button
//       className="p-2 bg-indigo-600 text-white rounded"
//       onClick={() => addToast('테스트 메시지입니다.', 'info')}
//     >
//       토스트 띄우기
//     </button>
//   )
// }
