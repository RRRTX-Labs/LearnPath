"use client";

import { ThemeProvider } from "next-themes";
import { ProgressProvider } from "./progress-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ProgressProvider>{children}</ProgressProvider>
    </ThemeProvider>
  );
}
