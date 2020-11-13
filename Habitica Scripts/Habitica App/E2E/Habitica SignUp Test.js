//Se asignan las dependencias necesarias para correr el test y así tomar los screenshots necesarios para hacer las pruebas VRT.
const wdio = require("webdriverio");
const assert = require("assert");
const { execSync } = require('child_process');
//Se asignan los atributos necesario para enviar al servidor de appium y de esta manera iniciar con las pruebas en la aplicación Wikipedia.
const opts = {
    port: 4723,
    path: "/wd/hub",
    capabilities: {
        platformName: 'Android',
        platformVersion: '11',
        deviceName: 'Nexus_5_API_30',
        app: '/Users/jeisson/Documents/Andes\ University/Courses/Pruebas\ Automaticas/Eleventh\ week/Project\ VRT/Wikipedia-Habitica/apk/Habitica-alpha-debug.apk',
        appPackage: 'com.habitrpg.android.habitica.debug',
        appActivity: 'com.habitrpg.android.habitica.ui.activities.MainActivity'
    },
};
//Asignación de variables globales, necesarias en múltiples funciones del programa.
let client;
let packageName = "com.habitrpg.android.habitica.debug";

describe("SignUp test", function() {

    beforeEach(async function() {
        //Se invoca la desinstalación de la app.
        uninstallApp();
        //Se crea el cliente de appium, pasando los parametros establecidos anteriormente.
        client = await wdio.remote(opts);
      });

    afterEach(async function() {
        //Se generar la desconexión del servidor de appium.
        await client.deleteSession();
      });

    it("Skip the homescreen ", async function() {
        //Se tiene la pausa inicial en la app
        await pauseClient(2000);
        //Se llama la funcion para omitir la pantalla inicial
        await skipSteps();
        //Se asigna el elemento boton para poder omitir la configuración inicial
        const buttonLogin = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.Button[2]');
        const visibleLogin = await buttonLogin.isDisplayed();
        assert(visibleLogin);
      });

    it("Wrong signup by password error on habitica ", async function() {
        //Se tiene la pausa inicial en la app
        await pauseClient(2000);
        //Se llama la funcion para omitir la pantalla inicial
        await skipSteps();
        //Se realiza la acción click en el boton de registro.
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
        //Se toma el elemento del error para validar su aparición
        const field = await client.$('android=new UiSelector().resourceId("com.habitrpg.android.habitica.debug:id/messageTextView")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se toma el texto del error para compararlo con el esperado
        const text = await field.getText();
        assert.equal(text, 'Your password has to be at least 8 characters long');
      });

    it("Wrong signup by email error on habitica ", async function() {
        //Se genera una pausa inicial de la app
        await pauseClient(2000);
        await skipSteps();
        //Se realiza la acción click en el boton de registro.
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
        await passwordInput.sendKeys(["Pruebas123"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const repeatPasswordInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[4]');
        await repeatPasswordInput.click();
        await repeatPasswordInput.sendKeys(["Pruebas123"]);
        //Se asigna a la variable, el elemento del boton donde se busca crear el registro
        const buttonSubmit = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[1]');
        await buttonSubmit.click();
        //Se toma el elemento del error para validar su aparición
        const field = await client.$('android=new UiSelector().resourceId("com.habitrpg.android.habitica.debug:id/messageTextView")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se toma el texto del error para compararlo con el esperado
        const text = await field.getText();
        assert.equal(text, 'Invalid email address.');
      });

    it("Wrong signup by usear already exist on habitica ", async function() {
        //Se genera una pausa inicial de la app
        await pauseClient(2000);
        await skipSteps();
        const registerButton = await ( await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.Button[1]')).click();
        //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
        const usernameInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[1]');
        await usernameInput.click();
        await usernameInput.sendKeys(["Pruebas"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el email
        const emailInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[2]');
        await emailInput.click();
        await emailInput.sendKeys(["Pruebas@email.com"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const passwordInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[3]');
        await passwordInput.click();
        await passwordInput.sendKeys(["Pruebas123"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const repeatPasswordInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[4]');
        await repeatPasswordInput.click();
        await repeatPasswordInput.sendKeys(["Pruebas123"]);
        //Se asigna a la variable, el elemento del boton donde se busca crear el registro
        const buttonSubmit = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[1]');
        await buttonSubmit.click();
        //Se toma el elemento del error para validar su aparición
        const field = await client.$('android=new UiSelector().resourceId("com.habitrpg.android.habitica.debug:id/messageTextView")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se toma el texto del error para compararlo con el esperado
        const text = await field.getText();
        assert.equal(text, 'Email address is already used in an account.');     
      });

});

    //Se realiza la desinstalación de la aplicación en caso de estar ya instalada en el emulador seleccionado.
    const uninstallApp = () => {
        try {
            execSync(`adb uninstall ${packageName}`);
        } catch (error) {
            console.log(error);
        }
    };

    //Se genera una pausa en el server para permitir cargar la pantalla en el emulador
    const pauseClient = async (time) => {
        await client.pause(time);
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

    //Se hace esta función con los pasos comunes para el login y signup.
    const skipSteps = async () => {
        //
        const field = await client.$('android=new UiSelector().text("SKIP")');
        const visible = await field.isDisplayed();
        assert(visible);
        await field.click();
    };