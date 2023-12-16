export type SourcePerformActionOnTargetUsing = {
  "version": "0.1.0",
  "name": "source_perform_action_on_target_using",
  "instructions": [
    {
      "name": "execute",
      "accounts": [
        {
          "name": "source",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "target",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "using",
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
        "defined": "(Creature,Creature,Creature)"
      }
    }
  ],
  "types": [
    {
      "name": "Action",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Damage"
          }
        ]
      }
    }
  ]
};

export const IDL: SourcePerformActionOnTargetUsing = {
  "version": "0.1.0",
  "name": "source_perform_action_on_target_using",
  "instructions": [
    {
      "name": "execute",
      "accounts": [
        {
          "name": "source",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "target",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "using",
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
        "defined": "(Creature,Creature,Creature)"
      }
    }
  ],
  "types": [
    {
      "name": "Action",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Damage"
          }
        ]
      }
    }
  ]
};
