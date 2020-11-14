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

    it("Wrong signup on wikipedia invalid username", async function() {
        //Se genera una pausa iniciar de la app
        await pauseClient(2000);
        //Se invoca la función para los pasos que llevan a la pantalla de signup
        await signUpSteps();        
        //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
        const usernameInput = await client.$('android=new UiSelector().text("Username")');
        await usernameInput.click();
        await usernameInput.sendKeys(["Pruebas"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const passwordInput = await client.$('android=new UiSelector().text("Password")');
        await passwordInput.click();
        //Se genera una pausa en el server para permitir cargar la pantalla en el emulador
        await pauseClient(1000);
        //Se valida el campo de error.
        const field = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/textinput_error")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se valida el texto que debe contener el elemento tomado
        const text = await field.getText();
        assert.equal(text, 'The user name "Pruebas" is not available. Please choose a different name.');
      });

    it("Wrong signup on wikipedia invalid email", async function() {
        //Se genera una pausa iniciar de la app
        await pauseClient(2000);
        //Se invoca la función para los pasos que llevan a la pantalla de signup
        await signUpSteps();        
        //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
        const usernameInput = await client.$('android=new UiSelector().text("Username")');
        await usernameInput.click();
        await usernameInput.sendKeys(["PruebasWiki1234"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const passwordInput = await client.$('android=new UiSelector().text("Password")');
        await passwordInput.click();
        await passwordInput.sendKeys(["Pruebas"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const repeatPasswordInput = await client.$('android=new UiSelector().text("Repeat password")');
        await repeatPasswordInput.click();
        await repeatPasswordInput.sendKeys(["Pruebas"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el email
        const emailInput = await client.$('android=new UiSelector().textContains("Email")');
        await emailInput.click();
        await emailInput.sendKeys(["Pruebas"]);
        //Se asigna a la variable, el elemento del boton donde se busca crear el registro
        const buttonSubmit = await client.$('android=new UiSelector().text("NEXT")');
        await buttonSubmit.click();
        //Se genera una pausa en el server para permitir cargar la pantalla en el emulador
        await pauseClient(1000);
        //Se valida el campo de error.
        const field = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/textinput_error")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se valida el texto que debe contener el elemento tomado
        const text = await field.getText();
        assert.equal(text, "Invalid email address");
      });

    it("Wrong signup on wikipedia invalid password", async function() {
        //Se genera una pausa iniciar de la app
        await pauseClient(2000);
        //Se invoca la función para los pasos que llevan a la pantalla de signup
        await signUpSteps();        
        //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
        const usernameInput = await client.$('android=new UiSelector().text("Username")');
        await usernameInput.click();
        await usernameInput.sendKeys(["PruebasWiki1234"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const passwordInput = await client.$('android=new UiSelector().text("Password")');
        await passwordInput.click();
        await passwordInput.sendKeys(["Pruebas"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const repeatPasswordInput = await client.$('android=new UiSelector().text("Repeat password")');
        await repeatPasswordInput.click();
        await repeatPasswordInput.sendKeys(["Pruebas123"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el email
        const emailInput = await client.$('android=new UiSelector().textContains("Email")');
        await emailInput.click();
        await emailInput.sendKeys(["fake@fake.com"]);
        //Se asigna a la variable, el elemento del boton donde se busca crear el registro
        const buttonSubmit = await client.$('android=new UiSelector().text("NEXT")');
        await buttonSubmit.click();
        //Se genera una pausa en el server para permitir cargar la pantalla en el emulador
        await pauseClient(1000);
        //Se valida el campo de error.
        const field = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/textinput_error")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se valida el texto que debe contener el elemento tomado
        const text = await field.getText();
        assert.equal(text, "Passwords don't match");
      });

    it("Success signup on wikipedia ", async function() {
        //Se genera una pausa iniciar de la app
        await pauseClient(2000);
        //Se invoca la función para los pasos que llevan a la pantalla de signup
        await signUpSteps();
        //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
        const usernameInput = await client.$('android=new UiSelector().text("Username")');
        await usernameInput.click();
        await usernameInput.sendKeys(["PruebasWiki1234"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const passwordInput = await client.$('android=new UiSelector().text("Password")');
        await passwordInput.click();
        await passwordInput.sendKeys(["Pruebas"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const repeatPasswordInput = await client.$('android=new UiSelector().text("Repeat password")');
        await repeatPasswordInput.click();
        await repeatPasswordInput.sendKeys(["Pruebas"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el email
        const emailInput = await client.$('android=new UiSelector().textContains("Email")');
        await emailInput.click();
        await emailInput.sendKeys(["fake@fake.com"]);
        //Se asigna a la variable, el elemento del boton donde se busca crear el registro
        const buttonSubmit = await client.$('android=new UiSelector().text("NEXT")');
        await buttonSubmit.click();
        //Se genera una pausa en el server para permitir cargar la pantalla en el emulador
        await pauseClient(1000);
        //Se invoca el metodo para responder no a la pregunta de auto relleno de los datos
        await noAutoFillSave();
        //Se toma el elemento que aparece en la siguiente pantalla de signup
        const field = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[1]/android.view.ViewGroup/android.widget.TextView');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se valida el texto que debe contener el elemento tomado
        const text = await field.getText();
        assert.equal(text, "Create an account");
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

    // //Se hace esta función con los pasos para dar en el boto de no en el mensaje de autoguardado de usuario y contraseña.
    const noAutoFillSave = async () => {
        try {
            const noButton = await client.$('android=new UiSelector().resourceId("android:id/autofill_save_no")');
            await noButton.click();
        } catch (error) {
            console.log(error);
        }
    };

    //Se hace esta función con los pasos comunes para el login y signup.
    const signUpSteps = async () => {
        //Se asigna a la variable el elmento de tipo boton para saltar las configuraciones iniciales de la app.    
        const button = await client.$('android=new UiSelector().text("SKIP")');
        await button.click();
        await pauseClient(1000);
        //Se toma el elemento more
        const buttonMore = await client.$('android=new UiSelector().text("More")');
        await buttonMore.click();
        //Se toma y presiona el elemento Login Signup
        const buttonLoginSignUp = await client.$('android=new UiSelector().textContains("LOG IN")');
        await buttonLoginSignUp.click();
        await pauseClient(1000);
    };