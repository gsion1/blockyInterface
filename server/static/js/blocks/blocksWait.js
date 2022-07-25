
 /*****************  WAIT seconds *************/
Blockly.defineBlocksWithJsonArray([
    {
      "type": "waitS",
      "message0": "Wait for %1 sec",
      "args0": [
        {
          "type": "field_number",
          "name": "delay",
          "value": 1,
          "precision": 0.1
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 160
    }
  ]);

   /*****************  WAIT minutes *************/

  Blockly.defineBlocksWithJsonArray([
    {
      "type": "waitM",
      "message0": "Wait for %1 min",
      "args0": [
        {
          "type": "field_number",
          "name": "delay",
          "value": 1,
          "precision": 1
        }
      ],
      
      "previousStatement": null,
      "nextStatement": null,
      "colour": 160
    }
  ]);

   /*****************  WAIT hours *************/

  Blockly.defineBlocksWithJsonArray([
    {
      "type": "waitH",
      "message0": "Wait for %1 hour",
      "args0": [
        {
          "type": "field_number",
          "name": "delay",
          "value": 1,
          "precision": 1
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 160
    }
  ]);
 
    /*****************  WAIT for button *************/
    Blockly.defineBlocksWithJsonArray([
      {
        "type": "waitButton",
        "message0": "Wait for a press on %1",
        "args0": [
          {
            "type": "field_input",
            "name": "button",
            "text":"Start"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
      }
    ]);