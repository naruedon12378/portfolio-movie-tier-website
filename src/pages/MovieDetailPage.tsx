import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { tmdbService } from "../services/tmdb.service";
import { fallbackMovies } from "../data/fallbackMovies";

export default function MovieDetailPage() {
  const { id } = useParams();

  const { data, isLoading, isError } =
    useQuery({
      queryKey: ["movie", id],
      queryFn: () =>
        tmdbService.getMovieDetail(
          id!
        ),
      retry: false,
      enabled: !!id,
    });

  const movie = useMemo(() => {
    if (!id) return fallbackMovies[0];

    const fallback =
      fallbackMovies.find(
        (item) => item.id === id
      );

    return data ?? fallback ?? fallbackMovies[0];
  }, [data, id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const poster =
    movie.poster_path
      ? movie.poster_path
      : "https://placehold.co/400x600/111827/ffffff?text=No+Cover";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="container mx-auto p-6">
        {isError && (
          <div className="mb-6 rounded-xl bg-yellow-100 p-4 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200">
            ขึ้น fallback data เพราะไม่สามารถโหลดข้อมูล API ได้
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 bg-white/90 dark:bg-slate-900/95 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <img src={poster} alt={movie.title} className="w-full md:w-80 rounded-lg" />

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">⭐ {movie.vote_average}</p>

            <p className="text-gray-700 dark:text-gray-200">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}