import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import { FavoritesProvider } from "./hooks/useFavorites";

import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <FavoritesProvider>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/movie/:id"
          element={
            <MovieDetailPage />
          }
        />

        <Route
          path="/favorites"
          element={
            <FavoritesPage />
          }
        />
      </Routes>
    </FavoritesProvider>
  );
}