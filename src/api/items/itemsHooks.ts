import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Item, fetchItems, ItemAddRequest, addItem } from "./itemService";

export function  useItems({sortingOptionRating, sortingOptionTitle}: {sortingOptionRating: string, sortingOptionTitle: string})     {
  return useQuery<Item[]>({
    queryKey: ["items", { sortingOptionRating, sortingOptionTitle }],
    queryFn: () => fetchItems({ title: sortingOptionTitle, rating: sortingOptionRating }),
  });
}


export function useAddItem() {
  //const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: ItemAddRequest) => {
      return addItem(item);
    },
    /*/onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
      });
    },*/
  });
}
