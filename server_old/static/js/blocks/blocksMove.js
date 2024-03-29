
/******************** Homing ************************/

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

Blockly.defineBlocksWithJsonArray([
  {
    "type": "homeOne",
    "message0": "Home %1 to dir %2",
    "args0": [
      {
        "type": "field_input",
        "name": "mqtt",
        "text": "Lineaire-1",
        "check": "String"

      },
      {
        "type": "field_dropdown",
        "name": "dir",
        "options": [
          ["Retracted", "-1"],
          ["Max ", "1"]
        ]
      }

    ],
    "nextStatement": null,
    "previousStatement": null,
    "colour": 270,
    "tooltip": "First block. Do a homing on specified module"
  }
]);

/******************** 3 VOIES ************************/
Blockly.defineBlocksWithJsonArray([
    {
      "type": "3Voies",
      "message0": "Set 3V %1 on %3 to pos %2",
      "args0": [
        {
          "type": "field_number",
          "name": "id",
          "value": 0,
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
            "text": "3voies-1",
            "check": "String"
  
          }
          
      ],
      "inputsInline": false,
      "previousStatement": null,
      "nextStatement": null,
      "colour": 200,
      "tooltip": "Move a 3V module to the desired position"
    }
  ]);

  /******************** Actuator ************************/

  Blockly.defineBlocksWithJsonArray([
    {
      "type": "actuator",
      "message0": "Move actuator %1 %2 to position %3 %4 with speed %5 %6 and accel %7",
      "args0": [
        {
          "type": "field_input",
          "name": "mqtt",
          "text": "Lineaire-1"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "pos",
          "text": 20,
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_number",
          "name": "speed",
          "value": 500,
          "min": 0,
          "max": 1000,
          "precision": 25
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_number",
          "name": "accel",
          "value": 200,
          "min": 0,
          "max": 1000,
          "precision": 25
        }
      ],
      "inputsInline": false,
      "previousStatement": null,
      "nextStatement": null,
      "colour": 200,
      "tooltip": "Move an actuator module to the desired position",
      "helpUrl": ""
    }]);