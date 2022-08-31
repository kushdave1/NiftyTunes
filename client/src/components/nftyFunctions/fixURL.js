export const fixURL = (url) => {
  
    if(url.startsWith("ipfs://ipfs")){

      return "https://ipfs.moralis.io:2053/"+url.split("ipfs://").pop()
    }
    else if(url.startsWith("https://ipfs.moralis.io:2053/")) {

      return url
      } 
    else if(url.startsWith("/ipfs")) {

      return "https://ipfs.moralis.io:2053"+url
    }
      //console.log("https://ipfs.moralis.io:2053/ipfs/".concat(url.split("ipfs://").pop()))
    return "https://ipfs.moralis.io:2053/ipfs/".concat(url.split("ipfs://").pop())
  };

export const fixImageURL = (url) => {
    if(url.startsWith("/ipfs")){
      return "https://ipfs.moralis.io:2053"+url
    }
    else {
      return url+"?format=json"
    }
  };