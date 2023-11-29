#include <M5StickCPlus.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// acccelerometer information
const int duration = 10000;

// WiFi login information 
const char* ssid = "";
const char* password = "";

void setup() {
  // initialize M5 stick
  M5.begin();
  // disconnect from any WiFi and reconnect to the specified SSID
  WiFi.disconnect();
  WiFi.begin(ssid,password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
  }
  // display that the WiFi has connected
  M5.Lcd.println("connected");
  // initialize the accelerometer
  M5.IMU.Init();
  // display that setup has completed
  M5.Lcd.println("Setup done");
}

void loop() {
  // once main button is pressed activate readings
  // read press state of the key
  M5.update(); 
  // if button A was pressed then 
  if (M5.BtnA.wasReleased()) {
    M5.Lcd.println("Button pressed");
    // time markers for the outer loop of 10 seconds that will serve as the limit for the data collecting time interval
    unsigned long startTime = millis();
    unsigned long currentTime;
    // set initial max velocity as 0
    float vMax = 0.0;

    // while time is less than 10 seconds (10000 ms)
    while ((currentTime = millis()) - startTime < duration) {
      // set accelerometer and velocity measurements to 0
      float ax, ay, az;
      float vX = 0.0, vY = 0.0, vZ = 0.0;
      float vTotal;
      // time measurements for inner loop of collectings accel. data for 1 second
      unsigned long dataStartTime = millis();
      unsigned long dataEndTime; 
      // add the readings to each acceleration vector    
      while ((dataEndTime = millis()) - dataStartTime < 1000) {
        // read data from accelerometer
        M5.IMU.getAccelData(&ax, &ay, &az);
        // negate the acceleration from gravity to measure user impact on M5Stick
        az -= 9.81;
        // set Z acceleration to 0 if somehow negative to maintain accuracy
        if (az < 0) {
          az = 0;
        }
        // calculate the velocity for each direction (d) using V(d) = V(d0) + a(d)*t
        vX += ax * 1.0 * 2.237;
        vY += ay * 1.0 * 2.237;
        vZ += az * 1.0 * 2.237;

        // delay readings because causing too much noise/ giving inconsistent results
        delay(100);
      }

      // get the total vector of velocity
      vTotal = sqrt(vX*vX + vY*vY + vZ*vZ);
      // set the new max if applicable
      if (vTotal > vMax) {
        vMax = vTotal;
      }

      // reset velocity measurements
      vX = vY = vZ = 0.0;

      // small delay
      delay(100);
    }

    // display final max velocity from the 10 second measurement interval
    M5.Lcd.print("Max Velocity:");
    M5.Lcd.println(vMax);

    // create HTTPClient object
    HTTPClient client;
    // create URL for the M5Stick to talk to with the max velocity results
    // THIS WILL CHANGE IF VM HAS TO RESTART
    String url = "http://34.66.63.33:8000/addVelo?newVelo=" + String(vMax) + "&apiKey=password";
    // connect M5Stick to the URL
    client.begin(url);
    // send get message and denote status with HTTP code
    int clientCode = client.GET();
    // display the HTTP code
    M5.Lcd.println("Http Response Code:" + String(clientCode));
    // get response from web app backend (server.js)
    String payload = client.getString();

    // JSON
    // initialize and read the payload from web app backend
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    // extract and display the status
    String status = doc["status"];
    M5.Lcd.println("Status:" + status);
    // close HTTP connection
    client.end();
  }
}
