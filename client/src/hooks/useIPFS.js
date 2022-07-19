export const useIPFS = () => {
  const resolveLink = (url) => {
    if (!url || !url.includes("ipfs://")) return "https://cloudflare-ipfs.com/".concat(url);
    return url.replace("ipfs://", "https://cloudflare-ipfs.com/");
  };

  return { resolveLink };
};
