import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import MovieGrid from "../components/movie/MovieGrid";
import MovieSearch from "../components/movie/MovieSearch";
import fallbackCover from "../assets/fallback-cover.png";
import { tmdbService } from "../services/tmdb.service";
import { fallbackMovies } from "../data/fallbackMovies";

interface MovieListResponse {
  movies: typeof fallbackMovies;
  nextPageToken?: string;
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [searchValue, setSearchValue] = useState(query);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [historyTokens, setHistoryTokens] = useState<(string | undefined)[]>([]);

  useEffect(() => {
    setSearchValue(query);
    setPageToken(undefined);
    setHistoryTokens([]);
  }, [query]);

  const { data, isLoading, isError } = useQuery<MovieListResponse>({
    queryKey: ["movies", query, pageToken],
    queryFn: () =>
      query
        ? tmdbService.searchMovies(query, pageToken)
        : tmdbService.getTrendingMovies(undefined, pageToken),
    retry: 0,
  });

  const handleSearch = (value: string) => {
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
      return;
    }

    setSearchParams({});
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handleNextPage = () => {
    const nextToken = data?.nextPageToken;
    if (!nextToken) return;

    setHistoryTokens((prev) => [...prev, pageToken]);
    setPageToken(nextToken);
  };

  const handleBackPage = () => {
    if (!historyTokens.length) return;

    setHistoryTokens((prev) => {
      const nextHistory = [...prev];
      const previousToken = nextHistory.pop();
      setPageToken(previousToken);
      return nextHistory;
    });
  };

  const movies = data?.movies ?? (isError ? fallbackMovies : []);
  const showFallback = isError && !data?.movies?.length;
  const pageNumber = historyTokens.length + 1;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-white/90">
        TMDB Movie Explorer
      </h1>

      <MovieSearch
        value={searchValue}
        onChange={setSearchValue}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!historyTokens.length}
            onClick={handleBackPage}
            className="rounded-lg border border-gray-700 bg-slate-800 px-4 py-3 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            Back
          </button>

          <button
            type="button"
            disabled={!data?.nextPageToken}
            onClick={handleNextPage}
            className="rounded-lg bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>

        <p className="text-sm text-gray-300">Page {pageNumber}</p>
      </div>

      {showFallback && (
        <div className="mb-8 overflow-hidden rounded-3xl border border-gray-800 bg-slate-950 shadow-2xl">
          <div className="relative">
            <img
              src={fallbackCover}
              alt="Fallback cover"
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="p-6 bg-slate-950 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Offline preview</p>
            <h2 className="mt-3 text-3xl font-semibold">
              Unable to load data from API
            </h2>
            <p className="mt-3 text-gray-400 max-w-2xl">
              The system is currently displaying fallback data for the movie list to ensure the website remains visually complete and easy to understand.
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <p className="text-gray-300">Loading...</p>
      )}

      <MovieGrid movies={movies} />
    </div>
  );
}