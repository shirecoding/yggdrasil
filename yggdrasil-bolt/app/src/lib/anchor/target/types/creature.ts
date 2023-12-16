export type Creature = {
  "version": "0.1.0",
  "name": "creature",
  "instructions": [],
  "accounts": [
    {
      "name": "creature",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "loggedIn",
            "type": "bool"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "category",
            "type": "u8"
          },
          {
            "name": "x",
            "type": "i16"
          },
          {
            "name": "y",
            "type": "i16"
          },
          {
            "name": "z",
            "type": "i16"
          },
          {
            "name": "hp",
            "type": "u16"
          },
          {
            "name": "maxHp",
            "type": "u16"
          },
          {
            "name": "mp",
            "type": "u16"
          },
          {
            "name": "maxMp",
            "type": "u16"
          },
          {
            "name": "state",
            "type": "u8"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "baseProficiencyDie",
            "type": "u8"
          },
          {
            "name": "numProficiencyDice",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

export const IDL: Creature = {
  "version": "0.1.0",
  "name": "creature",
  "instructions": [],
  "accounts": [
    {
      "name": "creature",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "loggedIn",
            "type": "bool"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "category",
            "type": "u8"
          },
          {
            "name": "x",
            "type": "i16"
          },
          {
            "name": "y",
            "type": "i16"
          },
          {
            "name": "z",
            "type": "i16"
          },
          {
            "name": "hp",
            "type": "u16"
          },
          {
            "name": "maxHp",
            "type": "u16"
          },
          {
            "name": "mp",
            "type": "u16"
          },
          {
            "name": "maxMp",
            "type": "u16"
          },
          {
            "name": "state",
            "type": "u8"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "baseProficiencyDie",
            "type": "u8"
          },
          {
            "name": "numProficiencyDice",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
