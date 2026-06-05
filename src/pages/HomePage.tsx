import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import MovieGrid from "../components/movie/MovieGrid";
import MovieSearch from "../components/movie/MovieSearch";
import fallbackCover from "../assets/fallback-cover.png";
import { tmdbService } from "../services/tmdb.service";
import { fallbackMovies } from "../data/fallbackMovies";

export default function HomePage() {
  const [searchParams, setSearchParams] =
    useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [searchValue, setSearchValue] =
    useState(query);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query],
    queryFn: () =>
      query
        ? tmdbService.searchMovies(query)
        : tmdbService.getTrendingMovies(),
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

  const movies = data ?? (isError ? fallbackMovies : []);
  const showFallback = isError && !data?.length;

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
              ไม่สามารถโหลดข้อมูลจาก API ได้
            </h2>
            <p className="mt-3 text-gray-400 max-w-2xl">
              ขณะนี้ระบบกำลังแสดงข้อมูลสำรองสำหรับรายการภาพยนตร์ เพื่อให้หน้าตาเว็บไซต์ยังคงดูสมบูรณ์และเข้าใจง่าย
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