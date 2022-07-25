/***************** At the same time ************/
Blockly.defineBlocksWithJsonArray([
  {
    "type": "atTheSameTime",
    "message0": "Do at the same time",
    
    "message1": "do %1",
    "args1": [
      {"type": "input_statement", "name": "DO"}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120
  }
]);

/***************** For loop *************/
 //start 2 movements at the same time
 Blockly.defineBlocksWithJsonArray([
    {
      "type": "for",
      "message0": "Count with \"i\" from %1 to %2 by %3",
      
      "args0": [
        {
          "type": "field_number",
          "name": "startValue",
          "value": 0,
          "min": -1000,
          "max": 1000,
          "precision": 0.1
        },
        {
          "type": "field_number",
          "name": "stopValue",
          "value": 10,
          "min": -1000,
          "max": 1000,
          "precision": 0.1
        },
        {
          "type": "field_number",
          "name": "increment",
          "value": 1,
          "min": -1000,
          "max": 1000,
          "precision": 0.1
        },
      ],
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
