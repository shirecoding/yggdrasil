import BN from "bn.js";

export function getRandomBN(bits: number): BN {
  const byteLength = Math.ceil(bits / 8);
  const randomBytes = crypto.getRandomValues(new Uint8Array(byteLength));

  return new BN(randomBytes);
}
