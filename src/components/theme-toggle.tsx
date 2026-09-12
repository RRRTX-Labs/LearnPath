"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "./ui";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!mounted) {
    return <span className="inline-block h-9 w-9" />;
  }
  const dark = (theme === "system" ? resolvedTheme : theme) === "dark";
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? "Light" : "Dark"}
    </Button>
  );
}
