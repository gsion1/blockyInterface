
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
 /*****************  At the same time *************/
 //start 2 movements at the same time
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "atTheSameTime",
      "message0": "At the same time",
      
      "message1": "do %1",
      "args1": [
        {"type": "input_statement", "name": "DO"}
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 120
    }
  ]);

   /*****************  syncronize *************/
 //start the actuators at the same time and for the same amount of time (speeds and accel and distance can be different)
 Blockly.defineBlocksWithJsonArray([
  {
    "type": "sync",
    "message0": "Synchronize",
    
    "message1": "do %1",
    "args1": [
      {"type": "input_statement", "name": "DO"}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120
  }
]);

   /*****************  Loop forever *************/
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "loopForever",
      "message0": "Loop forever",
      
      "message1": "do %1",
      "args1": [
        {"type": "input_statement", "name": "DO"}
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 120
    }
  ]);

    /*****************  WAIT for button *************/
    Blockly.defineBlocksWithJsonArray([
      {
        "type": "waitButton",
        "message0": "Wait for a press on %1",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "button",
            "options": [
              ["Button 1", "1"],
              ["Button 2", "2"],
              ["Button 3", "3"],
            ]
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
      }
    ]);