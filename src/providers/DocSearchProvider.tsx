import { createContext, FC, ReactNode, useContext } from "react";

import { DocSearch } from "@/utils/types";

const docSearchCtx = createContext<DocSearch>({
  appId: "",
  apiKey: "",
  indexName: "",
});

export const useDocSearch = () => useContext(docSearchCtx);

export const DocSearchProvider: FC<{
  children: ReactNode;
  docSearch: DocSearch;
}> = ({ children, docSearch }) => {
  return (
    <docSearchCtx.Provider value={docSearch}>{children}</docSearchCtx.Provider>
  );
};
