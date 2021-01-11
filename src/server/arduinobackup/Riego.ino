
const int waiting = 100; //buton waiting
const int On = LOW;
const int Off = HIGH;
const int full =1;
const int empty = 0;

unsigned long oneSecond = 1000;
unsigned long oneMinute = 60 * oneSecond;
unsigned long currentTime;
unsigned long previousTime = 0;
const int tank_buttonPin = 5; // Pin 5
const int tank_relayPin = 12; // Pin 12
unsigned long tank_pressedButtonTimer =0;
unsigned long tank_autoTimerOff =0;
const int tank_autoOffAt = 1;
int tank_relayState = Off;
int tank_changed =0;
unsigned long tank_autoTimerOn =0;
unsigned long tankAutoOnFrequency=5000;
bool tank_autoOn = false;


const int water_buttonPin = 6; // Pin 6
const int water_relayPin = 11; // Pin 11 
unsigned long water_pressedButtonTimer =0;
unsigned long water_autoTimerOff =0;
const int water_autoOffAt = 15;
int water_relayState = Off;
int water_changed =0;
unsigned long water_autoTimerOn =0;
unsigned long waterAutoOnFrequency =  oneMinute * 60 * 24 * 7;

const int pump_buttonPin =7; // Pin 7
const int pump_relayPin = 10; // Pin 10
unsigned long pump_pressedButtonTimer =0;
unsigned long pump_autoTimerOff = 0;
unsigned long pump_autoTimerOn = 0;
const int pump_autoOffAt = 2;
int pump_relayState = Off;
int pump_changed =0;

const int levelSensorPin = 3;
  const int Pressed = LOW;
  const int Released = HIGH;

const int lightSensorPin = A0;
int lightLevel = 0;
unsigned long lightLevel_Timer = 0;
const int recheckLightAfter = 5; // 5 seconds


bool checkLevel = true;
void setup() {
  initialisePin(pump_buttonPin, pump_relayPin, &pump_relayState);
  initialisePin(tank_buttonPin, tank_relayPin, &tank_relayState);
  initialisePin(water_buttonPin, water_relayPin, &water_relayState);
  checkLevel = true;
  pinMode(levelSensorPin, INPUT);

   Serial.begin(9600);
 //  Serial.println(analogRead(lightSensorPin));
//  Serial.println(digitalRead(levelSensorPin));

   lightLevel = getLighLevel();
}

void initialisePin(int buttonPin, int relayPin, int *relayState) {
  pinMode(relayPin, OUTPUT);
  pinMode(buttonPin, INPUT);
  *relayState = Off;
  digitalWrite(relayPin, HIGH);
  
}


// Electronic latch
// Read the state of the button
// Changes the state ON/OFF of the relays when pressing the button
// Implements an auto timer OFF.
// Ensure that keeping the button pressed does not affect the auto timer OFF 
// Uses pointers so this can be reause for the three buttons on the PCB board
void latch( int buttonPin, int relayPin, int *relayState, unsigned long *pressedButtonTimer, unsigned long *autoTimerOff, int *changed, int autoOffAt, bool autoOn, unsigned long *autoOnTimer, unsigned long autoOnFrequency ) {
 
 int buttonState = digitalRead(buttonPin);
  if (*changed == 1 && timeElapsed(waiting + *pressedButtonTimer)) {
    *changed =0;
  }
 
  if (autoOn) {
    if (*autoOnTimer==0 && *relayState == Off) {
      //Serial.println("auto timer on ON");
      *autoOnTimer = getTime();
      *autoTimerOff=getTime();
    }

  if (*autoOnTimer>0 && *relayState == Off &&  timeElapsed(autoOnFrequency + *autoOnTimer)) {
    *relayState = On;
    *autoOnTimer = 0;
    *autoTimerOff=getTime();
   //  Serial.println("turn pump onON");
    digitalWrite(relayPin, *relayState);
  }
  }
  
  
  if (*relayState == On &&  (autoOn == false || timeElapsed((autoOffAt*oneMinute) + *autoTimerOff))) {
    *relayState = Off;
    digitalWrite(relayPin, *relayState);
  }

  if (buttonState == Pressed) { 
     if (*changed == 0) {
       if (*relayState == Off) {
        *relayState =On;
        *autoTimerOff = getTime();
       } else {
        *relayState = Off;
       }
       digitalWrite(relayPin, *relayState);
       *changed = 1;
     }
     *pressedButtonTimer =getTime();
 }
}

// Reads the analog input from the light resitor and translate it into
// three light levels: 0,1,2 (night, low light,ok, sunny)
int getLighLevel() {
  int currentLightLevel = 0;
  int light = analogRead(lightSensorPin);
  if (light<30) currentLightLevel =0 ;
   if (light>30 && light<150) currentLightLevel =1;
  if (light>150 && light<350) currentLightLevel =2;
  if (light>350 && light<500) currentLightLevel =3;
  if (light>500) currentLightLevel =4;
 // Serial.println("Analog:" + String(light));
  //delay(250);
  // Serial.println(lightLevel);
  //Serial.println("Current LL:" + String(currentLightLevel));
  return currentLightLevel;  
}


// Depending on then light level set the AutoOn time.
unsigned long getPumpAutoOnFrequency() {
   int level = getLighLevel();
   unsigned long timer;
   if (level ==0)  timer = 50; // Turn the pump once per hour
   if (level ==1) timer = 20; // Turn the pump every 15 minutes
   if (level ==2) timer = 7; // Turn the pump every five minutes
   if (level ==3) timer = 3; // Turn the pump every five minutes
    if (level ==4) timer = 1; // Turn the pump every five minutes

   return (timer * oneMinute);
}

// Check if the light level has changed
// Uses a timer to avoid flickering
void checkLightLevel() {
 int currentLightLevel = getLighLevel();
 
 if (currentLightLevel!= lightLevel) {
   // Enable timer to recheck for a light change after some time
   if (lightLevel_Timer ==0) {
    lightLevel_Timer = getTime();
   }
 } else {
  // No change on the light level, disable timer
  lightLevel_Timer = 0;
 }

 // After a few seconds re-check levels
 if (lightLevel_Timer >0 && timeElapsed((recheckLightAfter*oneSecond) + lightLevel_Timer)) {
  lightLevel_Timer = 0;
 
  if (currentLightLevel != lightLevel) {
    // Update light level
    //Serial.println("Update light level from:" + String(lightLevel) + " to: " + String(currentLightLevel));
    lightLevel = currentLightLevel;
  }
 }
}

bool checkForTankOff = false;

// the level sensor must be on for at least 5 seconds (the autotimerON)
// if the sensor at any point detects full tank, the relay is turned off
// this also prevents the button from working if the tank is full
// the button can still be used to turn off the water at any time

void tankLevel() {

 // The sensor has indicated the tank is full
 // Keeps checking levels
 if (checkLevel) {
   
   //If the tank is empty, start auto on timer 
   //Don not check level for empty again till reset
   if (digitalRead(levelSensorPin) == empty) {
     tank_autoOn = true;
     checkLevel = false;
   }
 }

 // Continusly checking for tank full
 // If full turn off the auto on timer and enable
 // again the check for empty tank
 if (digitalRead(levelSensorPin) == full) {
   checkLevel = true;
   tank_autoOn = false;
   tank_autoTimerOn=0;
 }

 // If the water is on, this will happens after the autotimer is turned on
 // cache the state
 if (tank_relayState == On) {
     checkForTankOff = true;
 }

// the water has been turned ON, one the water is turned off, disable the auto on 
if (checkForTankOff) {
  if (tank_relayState == Off) {
    tank_autoOn = false;
    checkForTankOff = false;
  }
}
 
}



unsigned long getTime() {
  
  if ( previousTime>millis()) {
    Serial.println("what is going oni");
    water_pressedButtonTimer = getTime();
    water_autoTimerOff= getTime();
    water_autoTimerOn= getTime();

    pump_pressedButtonTimer =getTime();
    pump_autoTimerOff= getTime();
    pump_autoTimerOn= getTime();

    tank_pressedButtonTimer =getTime();
    tank_autoTimerOff= getTime();
    tank_autoTimerOn= getTime();
  }

  previousTime = millis();
  return millis();  
}

bool timeElapsed(unsigned long t2) {
  
  currentTime = getTime();
  if (currentTime == 0) {
    return true; // on timer overflow just say the time has passed;
  } else {
    return (currentTime>t2);  
  }
}


void loop() {

 
   tankLevel();
  
  latch(water_buttonPin, water_relayPin,&water_relayState,&water_pressedButtonTimer,&water_autoTimerOff,&water_changed,water_autoOffAt,true,&water_autoTimerOn,waterAutoOnFrequency);

  latch(pump_buttonPin, pump_relayPin,&pump_relayState,&pump_pressedButtonTimer,&pump_autoTimerOff,&pump_changed,pump_autoOffAt, true, &pump_autoTimerOn,getPumpAutoOnFrequency());

  latch(tank_buttonPin, tank_relayPin,&tank_relayState,&tank_pressedButtonTimer,&tank_autoTimerOff,&tank_changed,tank_autoOffAt,tank_autoOn,&tank_autoTimerOn,tankAutoOnFrequency);

  checkLightLevel();

}
