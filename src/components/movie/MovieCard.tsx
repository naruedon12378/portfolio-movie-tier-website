import { Link } from "react-router-dom";
import { Movie } from "../../types/movie";
import { useFavorites } from "../../hooks/useFavorites";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isRemotePoster = movie.poster_path?.startsWith("http");
  const posterSrc = movie.poster_path
    ? isRemotePoster
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "https://placehold.co/400x600/111827/ffffff?text=No+Cover";

  const posterSrcSet = movie.poster_path && !isRemotePoster
    ? `https://image.tmdb.org/t/p/w185${movie.poster_path} 185w, https://image.tmdb.org/t/p/w342${movie.poster_path} 342w, https://image.tmdb.org/t/p/w500${movie.poster_path} 500w`
    : undefined;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="relative block overflow-hidden rounded-xl transform hover:scale-105 transition-shadow duration-200 shadow-lg"
    >
      <img
        src={posterSrc}
        srcSet={posterSrcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        alt={movie.title}
        loading="lazy"
        className="w-full aspect-[2/3] object-cover"
      />

      <button
        onClick={(e) => {
          e.preventDefault();

          if (isFavorite(movie.id)) {
            removeFavorite(movie.id);
          } else {
            addFavorite(movie);
          }
        }}
        className="absolute top-3 right-3 bg-white/70 dark:bg-black/60 p-2 rounded-full backdrop-blur-sm"
        aria-label="Toggle favorite"
      >
        {isFavorite(movie.id) ? "❤️" : "🤍"}
      </button>

      <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/95 px-4 py-2 text-base font-bold text-white shadow-2xl ring-1 ring-white/10">
        <span className="text-yellow-300">★</span>
        <span>{movie.vote_average.toFixed(1)}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent text-white">
        <h3 className="font-semibold text-lg leading-tight">{movie.title}</h3>

        <p className="mt-2 text-sm text-gray-200 max-h-14 overflow-hidden text-ellipsis">{movie.overview}</p>
      </div>
    </Link>
  );
}
