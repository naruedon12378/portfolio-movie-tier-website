import { useDarkMode } from "../../hooks/useDarkMode";

export default function DarkModeToggle() {
  const { dark, toggleTheme } = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:opacity-90 transition"
    >
      <span className="text-lg">{dark ? "☀" : "🌙"}</span>
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}