export const useIPFS = () => {
  const resolveLink = (url) => {
    if (!url || !url.includes("ipfs://")) return "https://ipfs.infura.io".concat(url);
    return url.replace("ipfs://", "	https://ipfs.infura.io/");
  };

  return { resolveLink };
};
