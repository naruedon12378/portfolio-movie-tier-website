const IMDB_BASE = "https://api.imdbapi.dev";

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

function normalizePageToken(response: any) {
  return (
    response?.nextPageToken ||
    response?.next_page_token ||
    response?.pageToken ||
    response?.nextToken ||
    response?.next ||
    undefined
  );
}

function mapMovieListResponse(response: any) {
  return {
    movies: (response.titles || response.results || []).map(mapImdbTitleToMovie),
    nextPageToken: normalizePageToken(response),
  };
}

function buildPageTokenParam(pageToken?: string) {
  return pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "";
}

async function fetchJson(path: string) {
  const res = await fetch(`${IMDB_BASE}${path}`);
  if (!res.ok) throw new Error(`IMDB fetch failed: ${res.status}`);
  return res.json();
}

export const tmdbService = {
  getTrendingMovies(query?: string, pageToken?: string) {
    const queryParam = query ? `&query=${encodeURIComponent(query)}` : "";
    const tokenParam = buildPageTokenParam(pageToken);

    return fetchJson(`/titles?types=MOVIE${queryParam}${tokenParam}`).then(
      mapMovieListResponse
    );
  },

  searchMovies(query: string, pageToken?: string) {
    const tokenParam = buildPageTokenParam(pageToken);
    return fetchJson(
      `/search/titles?query=${encodeURIComponent(query)}&limit=30${tokenParam}`
    ).then(mapMovieListResponse);
  },

  getMovieDetail(id: string) {
    return fetchJson(`/titles/${id}`);
  },
};
