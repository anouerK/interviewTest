import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js";
import { supabase } from "../../config/supabase";
import z from "zod";

export type Item = {
  id: number;
  title: string;
  category: string;
  rating: number;
  updateAt: Date;
};

export const ItemAddSchema = z.object({
  title: z.string().min(5).max(30),
  category: z.string().min(3).max(20),
  rating: z.number().min(1).max(5),
});

export type ItemAddRequest = {
  title: string;
  category: string;
  rating: number;
};

export async function fetchItems(sort: { sortingOptionField: string; sortingOptionOrder: string}): Promise<Item[]> {
  const { error, data } = await supabase
    .from("items")
    .select("*")
    .order(sort.sortingOptionField, { ascending: sort.sortingOptionOrder === "asc" })
  if (error) {
    throw new Error(error.message);
  }
  return data as Item[];
}

export async function addItem(request: ItemAddRequest): Promise<Item> {
  const { error, data } = await supabase
    .from("items")
    .insert(request)
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data as Item;
}

