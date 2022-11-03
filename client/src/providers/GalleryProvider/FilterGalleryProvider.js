import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import FilterGalleryContext from "./FilterGalleryContext";

function FilterGalleryProvider({ children }) {
  const { web3, Moralis, user } = useMoralis();
  const [galleryTokenIds, setGalleryTokenIds] = useState([])
  const [fullTokenIds, setFullTokenIds] = useState([])


  return (
    <FilterGalleryContext.Provider value={{ galleryTokenIds, setGalleryTokenIds, fullTokenIds, setFullTokenIds}}>
      {children}
    </FilterGalleryContext.Provider>
  );
}

function useFilterGallery() {
  const context = React.useContext(FilterGalleryContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { FilterGalleryProvider, useFilterGallery };