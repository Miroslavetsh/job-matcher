import { create } from "zustand";
import { AppState, PageState } from "./types";
import { AppActions } from "./actions";

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set) => ({
  catalogue: null,
  results: [],
  pageState: "ready",
  errorMessage: "",

  setCatalogue: (catalogue) => set({ catalogue }),
  setResults: (results) =>
    set({
      results,
      pageState: results.length === 0 ? "empty" : "ready",
    }),
  setPageState: (pageState) => set({ pageState }),
  setErrorMessage: (errorMessage) => {
    if (errorMessage) {
      set({ errorMessage, pageState: "error" });
    } else {
      set({ errorMessage: "" });
    }
  },
  clearResults: () => set({ results: [], pageState: "ready" }),
  resetError: () => set({ errorMessage: "", pageState: "ready" }),
}));
