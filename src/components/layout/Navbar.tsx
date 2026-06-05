import {
  Link,
} from "react-router-dom";

import DarkModeToggle
from "../common/DarkModeToggle";

export default function Navbar() {
  return (
    <nav className="border-b mb-6 bg-gray-900/80 dark:bg-gray-900 text-white">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
          <span className="w-8 h-8 rounded-full btn-primary inline-block" />
          <span className="text-white">Movie Explorer</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/favorites" className="text-sm text-gray-200 hover:text-white">Favorites</Link>

          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}