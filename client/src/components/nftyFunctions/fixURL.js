export const fixURL = (url) => {
    if(url.startsWith("ipfs")){
      return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").pop()
    }
    else {
      return url+"?format=json"
    }
  };
export const fixImageURL = (url) => {
    if(url.startsWith("/ipfs")){
      return "https://ipfs.moralis.io:2053"+url
    }
    else {
      return url+"?format=json"
    }
  };