Blockly.defineBlocksWithJsonArray([
  {
    "type": "home",
    "message0": "Home everyone",
    "args0": [
      
    ],
    
    "nextStatement": null,
    
 
    "colour": 270,
    "tooltip": "First block. Do a homing on each module"
  }
]);

/******************** 3 VOIES ************************/
Blockly.defineBlocksWithJsonArray([
    {
      "type": "3Voies",
      "message0": "Set 3V %1 on concentrator %3 to position %2",
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
          },
          {
            "type": "field_input",
            "name": "mqtt",
            "text": "Concentrator-1",
            "check": "String"
  
          }
          
      ],
      
      "previousStatement": null,
      "nextStatement": null,
      "colour": 200,
      "tooltip": "Move a 3V module to the desired position"
    }
  ]);

  /******************** Actionneur ************************/

  Blockly.defineBlocksWithJsonArray([
    {
      "type": "actionneur",
      "message0": "Set actuator %1 on concentrator %4 to position %2 at %3 mm/s",
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
          },
          {
              "type": "field_number",
              "name": "speed",
              "value": 40,
              "min": 0,
              "max": 50,
              "precision": 1
            },
            {
              "type": "field_input",
              "name": "mqtt",
              "text": "Concentrator-1",
              "check": "String"
    
            }
      ],
      
      "previousStatement": null,
      "nextStatement": null,
      "colour": 200,
      "tooltip": "Move an actuator module to the desired position"
    }
  ]);

