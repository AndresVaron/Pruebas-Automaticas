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
        app: '/Users/jeisson/Documents/Andes\ University/Courses/Pruebas\ Automaticas/Eleventh\ week/Project\ VRT/Wikipedia-Habitica/apk/app-alpha-debug.apk',
        appPackage: 'org.wikipedia.alpha',
        appActivity: 'org.wikipedia.main.MainActivity'
    },
};
//Asignación de variables globales, necesarias en múltiples funciones del programa.
let client;
let packageName = "org.wikipedia.alpha";

describe("Login test", function() {

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
        //Se genera una pausa inicial de la app
        await pauseClient(2000);
        //Se asigna el elemento boton para poder omitir la configuración inicial
        const field = await client.$('android=new UiSelector().text("SKIP")');
        const visible = await field.isDisplayed();
        //Se realiza el oraculo la validación si es visible o no el elemento
        assert(visible);
        await field.click();
        //Se asigna el elemento y se realiza la validación de que este desplegado, para poder garantizar que se paso al home.
        const buttonMore = await client.$('android=new UiSelector().text("More")');
        const visibleMore = await buttonMore.isDisplayed();
        assert(visibleMore);
      });

    it("Wrong login on wikipedia", async function() {
        //Se genera una pausa inicial de la app
        await pauseClient(2000);
        //Se invoca la función que contiene los pasos para llegar a la pantalla de login
        await loginSteps();        
        //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
        const usernameInput = await client.$('android=new UiSelector().text("Username")');
        await usernameInput.click();
        await usernameInput.sendKeys(["PruebasWiki12"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const passwordInput = await client.$('android=new UiSelector().text("Password")');
        await passwordInput.click();
        await passwordInput.sendKeys(["WikiPass1"]);
        //Se asigna a la variable, el elemento del boton donde se realiza el inicio de sesión
        const buttonSubmit = await client.$('android=new UiSelector().text("LOG IN")');
        await buttonSubmit.click();
        await pauseClient(2000);
        //Se toma el elemento para validar que se llego al lugar deseado.
        const field = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/snackbar_text")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se realiza la validación de que el elemento tenga el texto esperado.
        const text = await field.getText();
        assert.equal(text, "Incorrect username or password entered.\nPlease try again.");
      });

    it("Success login on wikipedia ", async function() {
        //Se genera una pausa inicial de la app
        await pauseClient(2000);
        //Se invoca la función que contiene los pasos para llegar a la pantalla de login
        await loginSteps();
        //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
        const usernameInput = await client.$('android=new UiSelector().text("Username")');
        await usernameInput.click();
        await usernameInput.sendKeys(["PruebasWiki123"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const passwordInput = await client.$('android=new UiSelector().text("Password")');
        await passwordInput.click();
        await passwordInput.sendKeys(["WikiPass123"]);
        //Se asigna a la variable, el elemento del boton donde se realiza el inicio de sesión
        const buttonSubmit = await client.$('android=new UiSelector().text("LOG IN")');
        await buttonSubmit.click();
        await pauseClient(2000);
        //Se invoca el metodo para responder no a la pregunta de auto relleno de los datos
        await noAutoFillSave();
        //Se invoca el metodo para responder no a la pregunta de configuración de autofill.
        const buttonMore = await client.$('android=new UiSelector().text("More")');
        await buttonMore.click();
        //Se toma el elemento para validar que se llego al lugar deseado.
        const field = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/main_drawer_account_name")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se realiza la validación de que el elemento tenga el texto esperado.
        const text = await field.getText();
        assert.equal(text, "PruebasWiki123");
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
    const loginSteps = async () => {
        //Se asigna a la variable el elmento de tipo boton para saltar las configuraciones iniciales de la app.    
        const button = await client.$('android=new UiSelector().text("SKIP")');
        await button.click();
        await pauseClient(1000);
        //Se toma el elemento de opciones adicionales para poder darle click
        const buttonMore = await client.$('android=new UiSelector().text("More")');
        await buttonMore.click();
        //Se toma el elemento del boton login o signup
        const buttonLoginSignUp = await client.$('android=new UiSelector().textContains("LOG IN")');
        await buttonLoginSignUp.click();
        await pauseClient(1000);
        //Se asigna a la variable, el elemento del boton login
        const buttonLogin = await client.$('android=new UiSelector().text("LOG IN")');
        await buttonLogin.click();
    };