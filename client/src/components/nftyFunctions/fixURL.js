// export const fixURL = (url) => {
  
//     if(url.startsWith("ipfs://ipfs")){

//       return "https://ipfs.moralis.io:2053/"+url.split("ipfs://").pop()
//     }
//     else if(url.startsWith("https://ipfs.moralis.io:2053/")) {

//       return url
//       } 
//     else if(url.startsWith("/ipfs")) {

//       return "https://ipfs.moralis.io:2053"+url
//     }
//       //console.log("https://ipfs.moralis.io:2053/ipfs/".concat(url.split("ipfs://").pop()))
//     return "https://ipfs.moralis.io:2053/ipfs/".concat(url.split("ipfs://").pop())
//   };

export const fixURL = (url) => {
  
  if(url.startsWith("ipfs://ipfs")){
    console.log("https://ipfs.nftytunes.xyz/"+url.split("ipfs://").pop(), "FIXURL")
    return "https://cloudflare-ipfs.com/"+url.split("ipfs://").pop()
  }
  else if(url.startsWith("https://ipfs.moralis.io:2053/")) {
    console.log("https://ipfs.io/"+url.split("https://ipfs.moralis.io:2053/").pop(), "FIXURL")
    return url
    } 
  else if(url.startsWith("/ipfs")) {
    console.log("https://cloudflare-ipfs.com"+url, "FIXURL")
    return "https://cloudflare-ipfs.com"+url
  }
  console.log("https://cloudflare-ipfs.com/ipfs/".concat(url.split("ipfs://").pop()), "FIXURL")
  return "https://cloudflare-ipfs.com/ipfs/".concat(url.split("ipfs://").pop())
};


export const fixImageURL = (url) => {
    if(url.startsWith("/ipfs")){
      return "https://ipfs.moralis.io:2053"+url
    }
    else {
      return url+"?format=json"
    }
  };

