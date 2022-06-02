Blockly.defineBlocksWithJsonArray([
  {
    "type": "Home",
    "message0": "Home everyone",
    "args0": [
      
    ],
    
    "previousStatement": null,
    "nextStatement": null,
    "previousStatement": null,
    "colour": 200,
    "tooltip": "First block. Do a homing on each module"
  }
]);

/******************** 3 VOIES ************************/
Blockly.defineBlocksWithJsonArray([
    {
      "type": "3Voies",
      "message0": "Set 3V %1 to position %2",
      "args0": [
        {
          "type": "field_number",
          "name": "id",
          "value": 1,
          "precision": 1

        },
        {
            "type": "field_dropdown",
            "name": "pos",
            "options": [
              ["Pos1", "1"],
              ["Pos2", "2"],
              ["Pos3", "3"],
              ["Pos4", "4"]
            ]
          }
      ],
      
      "previousStatement": null,
      "nextStatement": null,
      "colour": 355,
      "tooltip": "Move a 3V module to the desired position"
    }
  ]);

  /******************** Actionneur ************************/

  Blockly.defineBlocksWithJsonArray([
    {
      "type": "actionneur",
      "message0": "Set actuator %1 to position %2",
      "args0": [
        {
          "type": "field_number",
          "name": "id",
          "value": 1,
          "precision": 1
        },
        {
            "type": "field_number",
            "name": "pos",
            "value": 100,
            "min": 0,
            "max": 300,
            "precision": 0.1
          }
      ],
      
      "previousStatement": null,
      "nextStatement": null,
      "colour": 355,
      "tooltip": "Move an actuator module to the desired position"
    }
  ]);