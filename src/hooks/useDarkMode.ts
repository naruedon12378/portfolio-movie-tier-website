import {
  useEffect,
  useState,
} from "react";

export function useDarkMode() {
  const [dark, setDark] =
    useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      const isDark = saved === "dark";
      if (isDark) document.documentElement.classList.add("dark");
      setDark(isDark);
      return;
    }

    // Default to system preference when no saved value
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;

    setDark(next);

    document.documentElement.classList.toggle(
      "dark"
    );

    localStorage.setItem(
      "theme",
      next
        ? "dark"
        : "light"
    );
  };

  return {
    dark,
    toggleTheme,
  };
}