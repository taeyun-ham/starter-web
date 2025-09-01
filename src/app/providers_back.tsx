// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/toast-provider";
import { ReactNode } from "react";

export default function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
