import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Item, fetchItems, ItemAddRequest, addItem } from "./itemService";

export function  useItems({sortingOptionField, sortingOptionOrder }: {sortingOptionField: string, sortingOptionOrder: string})     {
  return useQuery<Item[]>({
    queryKey: ["items", { sortingOptionField, sortingOptionOrder }],
    queryFn: () => fetchItems({ sortingOptionField, sortingOptionOrder }),
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
