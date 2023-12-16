import BN from "bn.js";

export function getRandomBN(bits: number): BN {
  const byteLength = Math.ceil(bits / 8);
  const randomBytes = crypto.getRandomValues(new Uint8Array(byteLength));

  return new BN(randomBytes);
}

export function serializeArgs(args: any = {}) {
  const jsonString = JSON.stringify(args);
  const encoder = new TextEncoder();
  const binaryData = encoder.encode(jsonString);
  return Buffer.from(
    binaryData.buffer,
    binaryData.byteOffset,
    binaryData.byteLength
  );
}
