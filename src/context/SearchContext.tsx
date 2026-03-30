import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SearchContextValue = {
  search: string;
  setSearch: (value: string) => void;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

type SearchProviderProps = {
  children: ReactNode;
};

export function SearchProvider({ children }: SearchProviderProps) {
  const [search, setSearch] = useState("");

  const value = useMemo<SearchContextValue>(
    () => ({
      search,
      setSearch,
    }),
    [search],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }

  return context;
}
