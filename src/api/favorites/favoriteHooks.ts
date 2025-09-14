import { useMutation, useQuery } from "@tanstack/react-query";
import {  Favorite, FavoriteRequest, fetchFavorites, toggleFavorite } from "./favoritiesService";

export function useFavorites() {
  return useQuery<Favorite[]>({
    queryKey: ["favorities"],
    queryFn: () => fetchFavorites(),
  });
}


//delete favorite  if exist else create favorite
export function useToggleFavorite() {

  return useMutation({
    mutationFn: (favoriteRequest: FavoriteRequest) => {
      return toggleFavorite(favoriteRequest);
    },

  });
}

