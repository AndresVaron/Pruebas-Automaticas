:: Ejecutar el emulador desde la consola
start C:\Users\LuisFer\AppData\Local\Android\Sdk\emulator\emulator -avd Nexus_5_API_26 -netdelay none -netspeed full > emulator.log
timeout 10
:: Instalar APK
:: C:\Users\LuisFer\AppData\Local\Android\Sdk\platform-tools\adb install Transmilenio.apk
:: timeout 10
:: Ejecutar pruebas random
C:\Users\LuisFer\AppData\Local\Android\Sdk\platform-tools\adb shell monkey -p com.habitrpg.android.habitica -v 1000 > adbshell.log
:: Mtar el emulador
C:\Users\LuisFer\AppData\Local\Android\Sdk\platform-tools\adb -e emu kill