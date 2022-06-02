
 // Import required libraries
#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include "SPIFFS.h"

// Replace with your network credentials
const char* ssid = "oneplus"; //Replace with your own SSID
const char* password = "partageco"; //Replace with your own password

const int ledPin = 2;
String ledState;

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

// Replaces placeholder with LED state value
String processor(const String& var){
  Serial.println(var);
  if(var == "GPIO_STATE"){
    if(digitalRead(ledPin)){
      ledState = "ON";
    }
    else{
      ledState = "OFF";
    }
    Serial.print(ledState);
    return ledState;
  }
  return String();
}

void writeFile(fs::FS &fs, const char * path, const char * message){
    Serial.printf("Writing file: %s\r\n", path);

    File file = fs.open(path, FILE_WRITE);
    if(!file){
        Serial.println("- failed to open file for writing");
        return;
    }
    if(file.print(message)){
        Serial.println("- file written");
    } else {
        Serial.println("- write failed");
    }
    file.close();
}

void deleteFile(fs::FS &fs, const char * path){
    Serial.printf("Deleting file: %s\r\n", path);
    if(fs.remove(path)){
        Serial.println("- file deleted");
    } else {
        Serial.println("- delete failed");
    }
}

String listDir(fs::FS &fs, const char * dirname, uint8_t levels){
    Serial.printf("Listing directory: %s\r\n", dirname);
    String files = "";
    File root = fs.open(dirname);
    if(!root){
        Serial.println("- failed to open directory");
        return "";
    }
    if(!root.isDirectory()){
        Serial.println(" - not a directory");
        return "";
    }

    File file = root.openNextFile();
    while(file){
        if(file.isDirectory()){
            Serial.print("  DIR : ");
            Serial.println(file.name());
            if(levels){
                listDir(fs, file.name(), levels -1);
            }
        } else {
            files+= String(file.name()) + ",";
            Serial.print("  FILE: ");
            Serial.print(file.name());
            Serial.print("\tSIZE: ");
            Serial.println(file.size());
        }
        file = root.openNextFile();
    }

    return files;
}


//from spiffs
void readFile(fs::FS &fs, const char * path){
    Serial.printf("Reading file: %s\n", path);

    File file = fs.open(path);
    if(!file){
        Serial.println("Failed to open file for reading");
        return;
    }

    Serial.print("Read from file: ");
    while(file.available()){
        Serial.write(file.read());
    }
    file.close();
}

char* string2char(String command){
    if(command.length()!=0){
        char *p = const_cast<char*>(command.c_str());
        return p;
    }
    return "default";
}
 
void setup(){

  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);

  // Initialize SPIFFS
  if(!SPIFFS.begin(true)){
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  // Print ESP32 Local IP Address
  Serial.println(WiFi.localIP());

  // Route for root / web page
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/blocky.html", String(), false, processor);
  });
  
  // Route to load style.css file
  server.on("/blocky.min.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/blocky.min.js", "text/js");
  });

  // Route to load style.css file
  server.on("/js/translate.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/js/translate.js", "text/js");
  });

  // Route to load style.css file
  /*
  server.on("/js/files.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/js/files.js", "text/js");
  });*/

  server.on("/blocks/moveToPosition.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/blocks/moveToPosition.js", "text/js");
  });

  server.on("/blocks/wait.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/blocks/wait.js", "text/js");
  });

  server.on("/blocky.min.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/blocky.min.js", "text/js");
  });

  server.on("/listFile", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/json", listDir(SPIFFS, "/s", 0));
  });


  //save a new program
  server.on("/sequence", HTTP_GET, [](AsyncWebServerRequest *request){
     Serial.print("paramsNr ");
    int paramsNr = request->params();
    Serial.println(paramsNr);

    char * filename = ""; char * content = ""; int state = 0;
    for(int i=0;i<paramsNr;i++){
 
        AsyncWebParameter* p = request->getParam(i);
        Serial.print("Param name: ");
        Serial.println(p->name());
        Serial.print("Param value: ");
        Serial.println(p->value());
        Serial.println("------");

        if(p->name() == "a"){
          //Serial.println("FileName");
          //Serial.println(p->value());
          filename = string2char("/s/"+p->value()+".txt");
          state+=1;
        }else if (p->name() == "c") {
          //Serial.println("content");
          //Serial.println(p->value());
          content = string2char(p->value());
          state+=2;
        }
    }

    if(state == 3){    
      Serial.println("Try to write");
      Serial.println(filename);
      Serial.println(content);
      //does not works with filename var, content same
      writeFile(SPIFFS, "/s/new.txt", content);
      /*if(writeFile(SPIFFS, filename, content))
        request->send(200, "text/plain", "File saved");
      else 
        request->send(200, "text/plain", "Failed to write file");
    }else {
      request->send(200, "text/plain", "Something went wrong with get params");*/
    }
  });

  //get the name of the file to start
  server.on("/start", HTTP_GET, [](AsyncWebServerRequest *request){

     Serial.print("paramsNr ");
    int paramsNr = request->params();
    Serial.println(paramsNr);
 
    for(int i=0;i<paramsNr;i++){
 
        AsyncWebParameter* p = request->getParam(i);
        Serial.print("Param name: ");
        Serial.println(p->name());
        Serial.print("Param value: ");
        Serial.println(p->value());
        Serial.println("------");

        if(p->name() == "s"){
          Serial.println("Starting ");
          Serial.println(p->value());
          readFile(SPIFFS, string2char("/s/"+p->value()));
        }
        
    }
 
    request->send(200, "text/plain", "Message received");
  });


  // Start server
  server.begin();

  readFile(SPIFFS, "/s/new.txt");
}
 
void loop(){
  
  
}
