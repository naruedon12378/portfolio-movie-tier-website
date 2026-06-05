const IMDB_BASE = 'https://api.imdbapi.dev';

function mapImdbTitleToMovie(item: any) {
  return {
    id: item.id,
    title: item.primaryTitle || item.originalTitle || "Untitled",
    poster_path: item.primaryImage?.url || "",
    backdrop_path: item.primaryImage?.url || "",
    vote_average: item.rating?.aggregateRating ?? 0,
    overview: item.plot || item.plotText || "",
    release_date: item.startYear?.toString() || "",
  };
}

async function fetchJson(path: string) {
  const res = await fetch(`${IMDB_BASE}${path}`);
  if (!res.ok) throw new Error(`IMDB fetch failed: ${res.status}`);
  return res.json();
}

export const tmdbService = {
  getTrendingMovies(query?: string, page = 1) {
    const searchParam = query ? `&query=${encodeURIComponent(query)}` : "";
    return fetchJson(`/titles?types=MOVIE${searchParam}&page=${page}`)
      .then((res: any) => (res.titles || []).map(mapImdbTitleToMovie));
  },

  searchMovies(query: string, page = 1) {
    return fetchJson(
      `/search/titles?query=${encodeURIComponent(query)}&limit=30`
    ).then((res: any) =>
      (res.results || res.titles || []).map(mapImdbTitleToMovie)
    );
  },

  getMovieDetail(id: string) {
    return fetchJson(`/title/${id}`).then(mapImdbTitleToMovie);
  }
};
