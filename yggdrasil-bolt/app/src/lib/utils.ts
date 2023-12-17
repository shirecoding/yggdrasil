import { IPFS_HTTP_GATEWAY } from "./defs";

export function nft_uri_to_url(uri: string): string {
  // extract CID from uri
  const regex = /ipfs:\/\/(.+)/;
  const match = uri.match(regex);

  if (!(match && match[1])) {
    throw new Error("nft metadata uri must start with ipfs://");
  }

  return `https://${IPFS_HTTP_GATEWAY}/ipfs/${match[1]}`;
}

export function addBaseUrl(url: string): string {
  if (process.env.ENVIRONMENT === "devnet") {
    return `/yggdrasil/${url}`;
  }
  return url;
}
