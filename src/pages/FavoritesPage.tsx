import MovieGrid
from "../components/movie/MovieGrid";

import {
  useFavorites,
}
from "../hooks/useFavorites";

export default function FavoritesPage() {
  const {
    favorites,
  } = useFavorites();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Favorites</h1>

        <MovieGrid movies={favorites} />
      </div>
    </div>
  );
}