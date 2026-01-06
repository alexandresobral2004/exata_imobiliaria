"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const [sonnerTheme, setSonnerTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setSonnerTheme(mediaQuery.matches ? "dark" : "light");
      
      const handler = (e: MediaQueryListEvent) => {
        setSonnerTheme(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      setSonnerTheme(theme as "light" | "dark");
    }
  }, [theme]);

  return (
    <Sonner
      theme={sonnerTheme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
