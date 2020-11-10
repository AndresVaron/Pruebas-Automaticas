//Se asignan las dependencias necesarias para correr el test y así tomar los screenshots necesarios para hacer las pruebas VRT.
const wdio = require("webdriverio");
const assert = require("assert");
const path = require('path');
const { execSync } = require('child_process');
//Se asignan los atributos necesario para enviar al servidor de appium y de esta manera iniciar con las pruebas en la aplicación Wikipedia.
const opts = {
    port: 4723,
    path: "/wd/hub",
    capabilities: {
        platformName: 'Android',
        platformVersion: '11',
        deviceName: 'Nexus_5_API_30',
        app: 'Ruta de la apk',
        appPackage: 'com.habitrpg.android.habitica.debug',
        appActivity: 'com.habitrpg.android.habitica.ui.activities.MainActivity'
    },
};
//Asignación de variables globales, necesarias en múltiples funciones del programa.
let client;
let picture = 0;
let name = "Habitica";
let packageName = "com.habitrpg.android.habitica.debug";

//Función principal que genera la orquestación de las demás funciones que cumplen con los pasos para tomar pantallas de las funcionalidades seleccionadas en la app. 
async function main () {
    //Se invoca el metodo para desinstalar la app.
    uninstallApp();
    //Se crea el cliente de appium, pasando los parametros establecidos anteriormente.
    client = await wdio.remote(opts);
    //Se invoca el metodo para tomar pantalla.
    await takeScreenshot();
    //Se asigna a la variable el elmento de tipo boton para saltar las configuraciones iniciales de la app.    
    const button = await client.$('android=new UiSelector().text("SKIP")');
    await button.click();
    await takeScreenshot();
    //Se invocan las funciones que contienen los pasos para tomar pantallas de cada una de las funcionalidades seleccionadas en la app.
    await signUp();
    await logIn();
    await client.deleteSession();
};

//Se realiza la desinstalación de la aplicación en caso de estar ya instalada en el emulador seleccionado.
const uninstallApp = () => {
    try {
        execSync(`adb uninstall ${packageName}`);
    } catch (error) {
        console.log(error);
    }
};

//Se toma la pantalla y se guarda en la ubicación deseada.
const takeScreenshot = async () => {
    await client.saveScreenshot(path.join(__dirname, `/screenshots/${name}/${picture}.png`));
    picture++;
};

//Se hace esta función con los pasos para dar en el boto de no en el mensaje de autoguardado de usuario y contraseña.
const noAutoFillSave = async () => {
    try {
        const noButton = await client.$('android=new UiSelector().resourceId("android:id/autofill_save_no")');
        await noButton.click();
    } catch (error) {
        console.log(error);
    }
};

//Se hace esta función con los pasos para diligenciar de una manera incorrecta el usuario y contraseña
const logIn = async () => {
    //Se asigna a la variable, el elemento del boton login
    const buttonLogin = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.Button[2]');
    await buttonLogin.click();
    await takeScreenshot();
    //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
    const usernameInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[1]');
    await usernameInput.click();
    await usernameInput.sendKeys(["PruebasHabitica123"]);
    //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
    const passwordInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[2]');
    await passwordInput.click();
    await passwordInput.sendKeys(["Pruebas123"]);
    //Se asigna a la variable, el elemento del boton donde se realiza el inicio de sesión
    const buttonSubmit = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[1]');
    await buttonSubmit.click();
    await takeScreenshot();
};

//Se hace esta función con los pasos para diligenciar la información necesaria para registrar una nueva cuenta, en este caso se busca que los datos diligenciados estén errados.
const signUp = async () => {
    const registerButton = await ( await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.Button[1]')).click();
    //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
    const usernameInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[1]');
    await usernameInput.click();
    await usernameInput.sendKeys(["Pruebas"]);
    //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el email
    const emailInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[2]');
    await emailInput.click();
    await emailInput.sendKeys(["Pruebas"]);
    //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
    const passwordInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[3]');
    await passwordInput.click();
    await passwordInput.sendKeys(["Pruebas"]);
    //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
    const repeatPasswordInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[4]');
    await repeatPasswordInput.click();
    await repeatPasswordInput.sendKeys(["Pruebas"]);
    //Se asigna a la variable, el elemento del boton donde se busca crear el registro
    const buttonSubmit = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[1]');
    await buttonSubmit.click();
    //Se toma la pantalla
    await takeScreenshot();
    //Se usa el back desde el driver para volver atrás en la app, a través del boton del celular.
    await client.back();
    await client.back();
    //Se genera una pausa en el server para permitir cargar la pantalla en el emulador
    await noAutoFillSave();
};

main();