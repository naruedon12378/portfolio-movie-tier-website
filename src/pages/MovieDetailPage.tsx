import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { tmdbService } from "../services/tmdb.service";
import { fallbackMovies } from "../data/fallbackMovies";

type Person = {
  id: string;
  displayName: string;
  primaryImage?: { url: string };
  primaryProfessions?: string[];
  alternativeNames?: string[];
};

type MovieDetail = {
  id: string;
  primaryTitle: string;
  originalTitle?: string;
  primaryImage?: { url: string };
  startYear?: number;
  runtimeSeconds?: number;
  genres?: string[];
  rating?: { aggregateRating?: number; voteCount?: number };
  metacritic?: { score?: number; reviewCount?: number };
  plot?: string;
  directors?: Person[];
  writers?: Person[];
  stars?: Person[];
  originCountries?: { code: string; name: string }[];
  spokenLanguages?: { code: string; name: string }[];
};

function formatRuntime(seconds?: number) {
  if (!seconds) return "N/A";
  const mins = Math.round(seconds / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function formatList(items?: string[]) {
  return items?.join(" • ");
}

export default function MovieDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery<MovieDetail>({
    queryKey: ["movie", id],
    queryFn: () => tmdbService.getMovieDetail(id!),
    retry: false,
    enabled: !!id,
  });

  const fallbackMovie = useMemo(() => {
    if (!id) return fallbackMovies[0];
    return fallbackMovies.find((item) => item.id === id) ?? fallbackMovies[0];
  }, [id]);

  const poster = data?.primaryImage?.url || fallbackMovie.poster_path || "https://placehold.co/500x750/111827/ffffff?text=No+Cover";
  const title = data?.primaryTitle || fallbackMovie.title;
  const year = data?.startYear || fallbackMovie.release_date || "N/A";
  const runtime = formatRuntime(data?.runtimeSeconds);
  const genres = formatList(data?.genres);
  const rating = data?.rating?.aggregateRating ?? fallbackMovie.vote_average;
  const votes = data?.rating?.voteCount;
  const metacritic = data?.metacritic?.score;
  const plot = data?.plot || fallbackMovie.overview;
  const directors = data?.directors?.map((person) => person.displayName).join(", ");
  const writers = data?.writers?.map((person) => person.displayName).join(", ");
  const stars = data?.stars?.slice(0, 6).map((person) => person.displayName).join(", ");
  const countries = data?.originCountries?.map((c) => c.name).join(", ");
  const languages = data?.spokenLanguages?.map((l) => l.name).join(", ");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">Loading movie details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-100 shadow-inner ring-1 ring-white/5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            ← Back
          </button>
          {isError && (
            <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-3 text-yellow-100">
              ไม่สามารถโหลดข้อมูล IMDb ได้ กำลังแสดงข้อมูลสำรอง
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
            <img src={poster} alt={title} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Movie</p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{title}</h1>
                  <p className="mt-2 text-sm text-gray-300">{year} • {runtime} • {genres || "Unknown Genre"}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-white shadow-inner ring-1 ring-white/10">
                  <span className="inline-flex items-center gap-2 text-amber-300">
                    <span>⭐</span>
                    <span>{rating.toFixed(1)}</span>
                  </span>
                  {votes ? <span>{votes.toLocaleString()} votes</span> : null}
                  {metacritic ? <span className="text-emerald-300">MC {metacritic}</span> : null}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold text-white">Plot</h2>
              <p className="mt-4 leading-relaxed text-gray-300">{plot}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-white">Creators</h3>
                <div className="mt-3 space-y-3 text-sm text-gray-300">
                  <p><span className="font-semibold text-white">Director:</span> {directors || "N/A"}</p>
                  <p><span className="font-semibold text-white">Writer:</span> {writers || "N/A"}</p>
                  <p><span className="font-semibold text-white">Stars:</span> {stars || "N/A"}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-white">Details</h3>
                <div className="mt-3 space-y-3 text-sm text-gray-300">
                  <p><span className="font-semibold text-white">Country:</span> {countries || "N/A"}</p>
                  <p><span className="font-semibold text-white">Language:</span> {languages || "N/A"}</p>
                  <p><span className="font-semibold text-white">Genres:</span> {genres || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
