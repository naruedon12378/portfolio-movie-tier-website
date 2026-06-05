import MovieCard from "./MovieCard";
import { Movie } from "../../types/movie";

interface Props {
  movies: Movie[];
}

export default function MovieGrid({
  movies,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>
  );
}