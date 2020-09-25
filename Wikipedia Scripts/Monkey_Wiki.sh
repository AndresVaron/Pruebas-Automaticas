# Ejecutar como super user
#sudo -s
# Ejecutar el emulador desde la consola
/Users/jeisson/Library/Android/sdk/emulator/emulator -avd Nexus_5_API_30 -netdelay none -netspeed full &> /tmp/emulator.log &
sleep 15
# Instalar APK
#/Users/jeisson/Library/Android/sdk/platform-tools/adb install Transmilenio.apk
#sleep 2m
# Ejecutar pruebas random
/Users/jeisson/Library/Android/sdk/platform-tools/adb shell monkey -p org.wikipedia -v 1000 &> /tmp/adbshell.log
# Matar el emulador
/Users/jeisson/Library/Android/sdk/platform-tools/adb -e emu kill