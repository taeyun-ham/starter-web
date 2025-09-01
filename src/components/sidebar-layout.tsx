"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  HomeIcon,
  UserGroupIcon,
  FolderIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

export default function SidebarLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoginPage = pathname === "/login";

  // 로그인 상태가 아니고, 로그인 페이지가 아니라면 → 로그인 페이지로 이동
  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.replace("/login");
    }
  }, [status, isLoginPage, router]);

  if (status === "loading") return null;

  if (status === "unauthenticated" || isLoginPage) {
    return <>{children}</>; // 로그인 페이지 또는 인증 안된 경우
  }

  const navItems = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Team", href: "/team", icon: UserGroupIcon },
    { name: "Projects", href: "/projects", icon: FolderIcon },
    { name: "Calendar", href: "/calendar", icon: CalendarIcon },
    { name: "Documents", href: "/documents", icon: DocumentDuplicateIcon },
    { name: "Reports", href: "/reports", icon: ChartPieIcon },
  ];

  return (
    <div className="advi adwe flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col justify-between">
        <div className="px-4 py-6">
          <div className="text-2xl font-bold text-center text-blue-400 mb-8">
            MyApp
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 text-xs text-gray-400">Your teams</div>
          <div className="mt-2 space-y-1">
            {["Heroicons", "Tailwind Labs", "Workcation"].map((name) => (
              <button
                key={name}
                className="w-full flex items-center px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                <span className="mr-3 inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-600 text-xs font-bold">
                  {name[0]}
                </span>
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* 하단 사용자 정보 + 로그아웃 */}
        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium">Tom Cook</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ml-2 text-gray-400 hover:text-red-400"
            title="로그아웃"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="border-2 border-dashed border-gray-700 rounded-lg h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
