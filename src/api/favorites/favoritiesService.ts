import { supabase } from "../../config/supabase";

export type Favorite = {
  client_id: number;
  item_id: string;
  created_at: string;
};

export type FavoriteRequest = {
  item_id: string;
};

export async function toggleFavorite(
  request: FavoriteRequest
): Promise<void> {
  const {  data } = await supabase
    .from("favorites")
    .select()
    .eq("client_id", import.meta.env.VITE_CLIENT_ID as string)
    .eq("item_id", request.item_id)
    .single();

  if (data) {
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("client_id", import.meta.env.VITE_CLIENT_ID as string)
      .eq("item_id", request.item_id);
    if (deleteError) {
        console.log("Delete Error:", deleteError);
      throw new Error(deleteError.message);
    }
  } else {
    const { error: insertError } = await supabase.from("favorites").insert({
      client_id: import.meta.env.VITE_CLIENT_ID as string,
      item_id: request.item_id,
    });
    if (insertError) {
      console.log("Insert Error:", insertError);
      throw new Error(insertError.message);
    }
  }
}

export async function fetchFavorites(): Promise<Favorite[]> {
  const { error, data } = await supabase.from("favorites").select("*").eq("client_id", import.meta.env.VITE_CLIENT_ID as string);
  if (error) {
    throw new Error(error.message);
  }
  return data ? data as Favorite[] : [];
}

export async function deleteFavorite(id: number): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
