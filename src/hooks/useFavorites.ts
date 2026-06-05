import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Movie } from "../types/movie";

import {
  getStorage,
  setStorage,
} from "../utils/storage";

const STORAGE_KEY = "favorite_movies";

interface FavoritesContextValue {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext =
  createContext<FavoritesContextValue | undefined>(
    undefined
  );

export function FavoritesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [favorites, setFavorites] =
    useState<Movie[]>([]);

  useEffect(() => {
    const saved = getStorage<Movie[]>(
      STORAGE_KEY,
      []
    );

    setFavorites(saved);
  }, []);

  const addFavorite = (movie: Movie) => {
    setFavorites((current) => {
      if (
        current.some(
          (item) => item.id === movie.id
        )
      ) {
        return current;
      }

      const next = [...current, movie];
      setStorage(STORAGE_KEY, next);
      return next;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.filter(
        (item) => item.id !== id
      );
      setStorage(STORAGE_KEY, next);
      return next;
    });
  };

  const isFavorite = useMemo(
    () => (id: string) =>
      favorites.some((item) => item.id === id),
    [favorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
    }),
    [favorites, addFavorite, removeFavorite, isFavorite]
  );

  return React.createElement(
    FavoritesContext.Provider,
    { value },
    children
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites must be used within FavoritesProvider"
    );
  }

  return context;
}
