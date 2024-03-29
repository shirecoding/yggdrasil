export type ModifyCreature = {
  "version": "0.1.0",
  "name": "modify_creature",
  "instructions": [
    {
      "name": "execute",
      "accounts": [
        {
          "name": "creature",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": "bytes"
        }
      ],
      "returns": {
        "defined": "Creature"
      }
    }
  ],
  "types": [
    {
      "name": "Modification",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialize"
          }
        ]
      }
    }
  ]
};

export const IDL: ModifyCreature = {
  "version": "0.1.0",
  "name": "modify_creature",
  "instructions": [
    {
      "name": "execute",
      "accounts": [
        {
          "name": "creature",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": "bytes"
        }
      ],
      "returns": {
        "defined": "Creature"
      }
    }
  ],
  "types": [
    {
      "name": "Modification",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialize"
          }
        ]
      }
    }
  ]
};
