import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Item } from "./api/items/itemService";
import { useAddItem, useItems } from "./api/items/itemsHooks";
import { useEffect, useMemo, useState } from "react";
import { useFavorites, useToggleFavorite } from "./api/favorites/favoriteHooks";
import debouce from "lodash.debounce";

function App() {
  const queryClient = new QueryClient();
  /*
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ItemAddSchema),
  });*/

  const [searchTerm, setSearchTerm] = useState("");
  const [sortingOptionField, setSortingOptionField] = useState("rating");
  const [sortingOptionOrder, setSortingOptionOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const { mutate: addItem } = useAddItem();
  const { mutate: toggleFavorite } = useToggleFavorite();

  const {
    data: items,
    error: itemsError,
    isLoading: itemsLoading,
  } = useItems({ sortingOptionField, sortingOptionOrder });

  const { data: favorites, error: favoritesError } = useFavorites();

  const handleAddItem = (form: {
    title: string;
    category: string;
    rating: number;
  }) => {
    const item = {
      title: form.title,
      category: form.category,
      rating: form.rating,
    };
    addItem(item);
  };

  function paginateArray(array: Item[], pageSize: number, pageNumber: number) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    return array.slice(startIndex, endIndex);
  }
  function getStatus(item: Item) {
    if (
      favorites &&
      favorites.find((fav) => fav.item_id == item.id.toString())
    ) {
      return " (Favorite)";
    } else {
      return "Not Favorite ";
    }
  }
  function handleToggleFavorite(item: Item) {
    toggleFavorite({ item_id: item.id.toString() });
  }

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <input
          type="text"
          placeholder="Search..."
          onChange={debouncedResults}
        />
        <h1>
          {" "}
          Sorting By : {sortingOptionField == "rating" ? "Rating" : "Title"}
          <input
            type="checkbox"
            onClick={() => {
              if (sortingOptionField == "rating") {
                setSortingOptionField("title");
              } else {
                setSortingOptionField("rating");
              }
            }}
          />
        </h1>

        <h1>
          {" "}
          Sorting : {sortingOptionOrder == "asc" ? "Ascending" : "Descending"}
          <input
            type="checkbox"
            onClick={() => {
              if (sortingOptionOrder == "asc") {
                setSortingOptionOrder("desc");
              } else {
                setSortingOptionOrder("asc");
              }
            }}
          />
        </h1>
        {/* <form
          onSubmit={handleSubmit((d) => handleAddItem(d))}
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        >
          <input
            {...register("title", { required: true })}
            placeholder="title"
          />
          {errors.title && <span>Title is required</span>}
          <input
            {...register("category", { required: true })}
            placeholder="category"
          />
          {errors.category && <span>Category is required</span>}
          <input
            {...register("rating", { required: true })}
            placeholder="rating"
            type="number"
          />
          {errors.rating && <span>Rating is required</span>}
          <button type="submit">Add</button>
        </form> */}
        {itemsLoading && <p>Loading...</p>}
        {itemsError && <p>Error: {(itemsError as Error).message}</p>}
        {items?.length >= 1 ? (
          <ul>
            {paginateArray(items, 10, currentPage)
              .filter((item: Item) => item.title.includes(searchTerm))
              .map((item) => (
                <li key={item.id}>
                  [{item.id}] {item.title} - {item.category} - {item.rating} -{" "}
                  <button onClick={() => handleToggleFavorite(item)}>
                    {getStatus(item)}
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          !itemsLoading && <p>No items found.</p>
        )}

        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </button>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={paginateArray(items || [], 10, currentPage).length < 10}
        >
          Next
        </button>
      </QueryClientProvider>
    </>
  );
}
export default App;
