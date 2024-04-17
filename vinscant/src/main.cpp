#include <WebServer.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <MFRC522.h>
#include <HttpClient.h>

//set up to connect to an existing network (e.g. mobile hotspot from laptop that will run the python code)
const char* ssid = "Zeus WPI";
const char* password = "zeusisdemax";
WiFiUDP Udp;
unsigned int localUdpPort = 4210;  //  port to listen on
char incomingPacket[255];  // buffer for incoming packets

#define RST_PIN         0          // Configurable, see typical pin layout above
#define SS_PIN          34
MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance

void sendUID();

void setup()
{
    int status = WL_IDLE_STATUS;
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    Serial.println("");

    // Wait for connection
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("Connected to wifi");
    Udp.begin(localUdpPort);
    Serial.printf("Now listening at IP %s, UDP port %d\n", WiFi.localIP().toString().c_str(), localUdpPort);
    SPI.begin();			// Init SPI bus
    mfrc522.PCD_Init();
}

void loop()
{
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
	if ( ! mfrc522.PICC_IsNewCardPresent()) {
		return;
	}

	// Select one of the cards
	if ( ! mfrc522.PICC_ReadCardSerial()) {
		return;
	}

    sendUID();
    mfrc522.PICC_HaltA();
}

void sendUID() {
    Udp.beginPacket("10.0.10.0", 22345);
    for (byte i = 0; i < mfrc522.uid.size; i++) {
        Udp.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
        Udp.print(mfrc522.uid.uidByte[i], HEX);
        Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
        Serial.print(mfrc522.uid.uidByte[i], HEX);
    }
    Udp.println();
    Serial.println();
    Udp.endPacket();
}

