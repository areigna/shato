/*
 * Copyright (c) 2016 Intel Corporation.  All rights reserved.
 * See the bottom of this file for the license terms.
 */

#include <CurieBLE.h>

BLEPeripheral blePeripheral; // create peripheral instance

BLEService shatoService("AAAA"); // create service

// create switch characteristic and allow remote device to read and write
BLECharCharacteristic lightChar("A012", BLERead | BLEWrite);
BLECharCharacteristic doorOpenChar("D011", BLERead | BLEWrite);
BLECharCharacteristic doorCloseChar("D010", BLERead | BLEWrite);


// SETUP
void setup() {
  Serial.begin(9600);

  // Set Pins
  pinMode(13, OUTPUT); // BLE indicator
  pinMode(12, OUTPUT); // Light
  pinMode(11, OUTPUT); // Door Open
  pinMode(10, OUTPUT); // Door Close

  // set the local name peripheral advertises
  blePeripheral.setDeviceName("SHATO Beta");
  blePeripheral.setLocalName("Shato");
  // set the UUID for the service this peripheral advertises
  blePeripheral.setAdvertisedServiceUuid(shatoService.uuid());

  // add service and characteristic
  blePeripheral.addAttribute(shatoService);
  blePeripheral.addAttribute(lightChar);
  blePeripheral.addAttribute(doorOpenChar);
  blePeripheral.addAttribute(doorCloseChar);

  // assign event handlers for connected, disconnected to peripheral
  blePeripheral.setEventHandler(BLEConnected, connectHandler);
  blePeripheral.setEventHandler(BLEDisconnected, disconnectHandler);

  // assign event handlers for characteristic
  lightChar.setEventHandler(BLEWritten, lightCharWritten);
  doorOpenChar.setEventHandler(BLEWritten, doorOpenCharWritten);
  doorCloseChar.setEventHandler(BLEWritten, doorCloseCharWritten);

  // set an initial value for the characteristic
  lightChar.setValue(0);
  doorOpenChar.setValue(0);
  doorCloseChar.setValue(0);

  // advertise the service
  blePeripheral.begin();
  Serial.println(("Bluetooth device active, waiting for connections..."));
}


// START LOOP
void loop() {
  // poll peripheral
  blePeripheral.poll();
  
}


// Connect / Disconnect Event
void connectHandler(BLECentral& central) {
  // central connected event handler
  digitalWrite(13, HIGH);
  Serial.print("Connected event, central: ");
  Serial.println(central.address());
}

void disconnectHandler(BLECentral& central) {
  // central disconnected event handler
  digitalWrite(13, LOW);
  Serial.print("Disconnected event, central: ");
  Serial.println(central.address());
}



// Light Event
void lightCharWritten(BLECentral& central, BLECharacteristic& characteristic) {
  Serial.print("Light event, written: ");
  Serial.println(lightChar.value());

  if (lightChar.value() == 't') {
    Serial.println("LED on");
    digitalWrite(12, HIGH);
  } else if (lightChar.value() == 'f') {
    Serial.println("LED off");
    digitalWrite(12, LOW);
  }
}


// Door Open Event
void doorOpenCharWritten(BLECentral& central, BLECharacteristic& characteristic) {
  Serial.print("Door Open event, written: ");
  Serial.println(doorOpenChar.value());

  if (doorOpenChar.value() == 't') {
    Serial.println("Door Start Open");
    digitalWrite(11, HIGH);
    //delay(2500);
    //digitalWrite(11, LOW);
  } else if (doorOpenChar.value() == 'f') {
    Serial.println("Door Finish Open");
    digitalWrite(11, LOW);
  }
}

// Door Open Event
void doorCloseCharWritten(BLECentral& central, BLECharacteristic& characteristic) {
  Serial.print("Door Close event, written: ");
  Serial.println(doorCloseChar.value());

  if (doorCloseChar.value() == 't') {
    Serial.println("Door Start Close");
    digitalWrite(10, HIGH);
    //delay(2500);
    //digitalWrite(10, LOW);
  } else if (doorCloseChar.value() == 'f') {
    Serial.println("Door Finish Close");
    digitalWrite(10, LOW);
  }
}

