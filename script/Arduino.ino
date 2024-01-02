#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SoftwareSerial.h>
#include <DFRobotDFPlayerMini.h>
#include <DFRobotDFPlayerMini.h>
#include "esp_camera.h"

const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";
const char* serverAddress = "http://192.168.x.x:5000";
const char* serverPath = "/recognize_face";

const uint8_t PIN_PLAYER_STATE = 13;
const uint8_t PIN_MP3_TX = 10;
const uint8_t PIN_MP3_RX = 11;
const int DEFAULT_VOLUME = 20;
SoftwareSerial mySoftwareSerial(PIN_MP3_RX, PIN_MP3_TX);
DFRobotDFPlayerMini myDFPlayer;

const int captureInterval = 30000;
unsigned long lastCaptureTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to Wi-Fi...");
  }
  Serial.println("Connected to Wi-Fi");

  mySoftwareSerial.begin(9600);
  if (!myDFPlayer.begin(mySoftwareSerial)) {
    Serial.println("Failed to initialize DFPlayer Mini.");
    return;
  }
  myDFPlayer.volume(DEFAULT_VOLUME);

  // Initialize camera
  camera_config_t camera_config;
  // Modify these parameters to match your specific ESP32-CAM pinout and preferences
  camera_config.ledc_channel = LEDC_CHANNEL_0;
  camera_config.ledc_timer = LEDC_TIMER_0;
  camera_config.pin_d0 = 32;
  camera_config.pin_d1 = 35;
  camera_config.pin_d2 = 34;
  camera_config.pin_d3 = 5;
  camera_config.pin_d4 = 39;
  camera_config.pin_d5 = 18;
  camera_config.pin_d6 = 36;
  camera_config.pin_d7 = 19;
  camera_config.pin_xclk = 27;
  camera_config.pin_pclk = 21;
  camera_config.pin_vsync = 25;
  camera_config.pin_href = 26;
  camera_config.pin_sscb_sda = 14;
  camera_config.pin_sscb_scl = 12;
  camera_config.pin_pwdn = 33;
  camera_config.pin_reset = 15;
  camera_config.xclk_freq_hz = 20000000;
  camera_config.pixel_format = PIXFORMAT_JPEG;
  camera_config.frame_size = FRAMESIZE_UXGA;
  camera_config.jpeg_quality = 12;
  camera_config.fb_count = 1;
  esp_err_t err = esp_camera_init(&camera_config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
}


void loop() {
  if (millis() - lastCaptureTime >= captureInterval) {
    captureImage();
    lastCaptureTime = millis();
  }
}
void playMP3(int fileNumber) {
  if (fileNumber != 0) {
    myDFPlayer.play(fileNumber);
  }
}
void captureImage() {
  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    return;
  }

  HTTPClient http;
  WiFiClient client;
  String url = String(serverAddress) + String(serverPath);
  http.begin(client, url);
  http.addHeader("Content-Type", "image/jpeg");
  int httpResponseCode = http.POST(fb->buf, fb->len);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Server Response: " + response);

    DynamicJsonDocument doc(1024);
    deserializeJson(doc, response);
    int fileNumber = doc["file_number"];  // Make sure this key matches the Flask response
    playMP3(fileNumber);
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  esp_camera_fb_return(fb);
}
