export type SystemMovement = {
  "version": "0.1.0",
  "name": "system_movement",
  "instructions": [
    {
      "name": "execute",
      "accounts": [
        {
          "name": "position",
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
        "defined": "Position"
      }
    }
  ]
};

export const IDL: SystemMovement = {
  "version": "0.1.0",
  "name": "system_movement",
  "instructions": [
    {
      "name": "execute",
      "accounts": [
        {
          "name": "position",
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
        "defined": "Position"
      }
    }
  ]
};
