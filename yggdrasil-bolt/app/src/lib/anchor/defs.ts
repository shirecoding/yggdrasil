export const WORLD_ID = 0; // -1 means not initialized (set once for devnet to create)
export const PROGRAM_IDS = {
  localnet: {
    yggdrasil: "9JBtwqvWsuEKUpswiR6vERUXnmcSGVXWUfsr7N8RQQTk",
    creature: "3nt8wnuNGQKG57UgSDsM1HL86kQZcwjbv95V9ZUexW2a",
    modifyCreature: "42Pm1FeYouSPvTmHsJKkqZcQbhhxhGZCQSnvJQM9TkiE",
    sourcePerformActionOnTargetUsing:
      "9NEta1kQAHsxSBnfjEpC9wfaDwpAVgt3pdnnDWhwAird",
  },
  devnet: {
    yggdrasil: "9JBtwqvWsuEKUpswiR6vERUXnmcSGVXWUfsr7N8RQQTk",
    creature: "3nt8wnuNGQKG57UgSDsM1HL86kQZcwjbv95V9ZUexW2a",
    modifyCreature: "42Pm1FeYouSPvTmHsJKkqZcQbhhxhGZCQSnvJQM9TkiE",
    sourcePerformActionOnTargetUsing:
      "9NEta1kQAHsxSBnfjEpC9wfaDwpAVgt3pdnnDWhwAird",
  },
  mainnet: {
    yggdrasil: "9JBtwqvWsuEKUpswiR6vERUXnmcSGVXWUfsr7N8RQQTk",
    creature: "3nt8wnuNGQKG57UgSDsM1HL86kQZcwjbv95V9ZUexW2a",
    modifyCreature: "42Pm1FeYouSPvTmHsJKkqZcQbhhxhGZCQSnvJQM9TkiE",
    sourcePerformActionOnTargetUsing:
      "9NEta1kQAHsxSBnfjEpC9wfaDwpAVgt3pdnnDWhwAird",
  },
};
export const DISCRIMINATOR_SIZE = 8;
export const PUBKEY_SIZE = 32;
export const U8_SIZE = 1;
export const U64_SIZE = 8;
export const BOOL_SIZE = 1;
export const STRING_PREFIX_SIZE = 4;
export const BUMP_SIZE = 1;
export const GEO_SIZE = STRING_PREFIX_SIZE + 6; // 6 characters of resolution
export const TWO_FACTOR_SIZE = U8_SIZE * 32; // 256 bit
export const REGION_SIZE = STRING_PREFIX_SIZE + 3; // 3 digit country code
export const COUPON_NAME_SIZE = STRING_PREFIX_SIZE + 36;
export const COUPON_SYMBOL_SIZE = STRING_PREFIX_SIZE + 14;
export const COUPON_URI_SIZE = STRING_PREFIX_SIZE + 204;
