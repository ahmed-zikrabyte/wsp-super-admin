"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Button } from "../ui/button";

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  const handleSetTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    setTheme(theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, [setTheme]);

  return (
    <div className="flex flex-wrap gap-2 p-2">
      <Button onClick={() => handleSetTheme("light")}>Light Mode</Button>
      <Button onClick={() => handleSetTheme("dark")}>Dark Mode</Button>
    </div>
  );
}
