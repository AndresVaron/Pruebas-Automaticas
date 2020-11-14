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

describe("Login test", function() {

    beforeEach(async function() {
        //Se invoca la desinstalación de la app.
        uninstallApp();
        //Se crea el cliente de appium, pasando los parametros establecidos anteriormente.
        client = await wdio.remote(opts);
        // client.setTimeouts(40000);
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
        //Se toma el boton login del home como referencia para garantizar que el paso anterior fue exitoso.
        const buttonLogin = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.Button[2]');
        const visibleLogin = await buttonLogin.isDisplayed();
        assert(visibleLogin);
      });

    it("Wrong login on habitica ", async function() {
        //Se tiene la pausa inicial en la app
        await pauseClient(2000);
        //Se llama la funcion para omitir la pantalla inicial
        await skipSteps();
        //Se asigna a la variable, el elemento del boton login
        const buttonLogin = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.Button[2]');
        await buttonLogin.click();
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
        //Se toma el elemento del mensaje de error para validar su aparición
        const field = await client.$('android=new UiSelector().resourceId("com.habitrpg.android.habitica.debug:id/messageTextView")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se toma el texto del error para compararlo con el esperado
        const text = await field.getText();
        assert.equal(text, 'Uh-oh - your email address / username or password is incorrect.\n- Make sure they are typed correctly. Your username and password are case-sensitive.\n- You may have signed up with Facebook or Google-sign-in, not email so double-check by trying them.\n- If you forgot your password, click "Forgot Password".');
      });

    it("Success login on habitica ", async function() {
        await pauseClient(2000);
        await skipSteps();
        //Se asigna a la variable, el elemento del boton login
        const buttonLogin = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.Button[2]');
        await buttonLogin.click();
        //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
        const usernameInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[1]');
        await usernameInput.click();
        await usernameInput.sendKeys(["pa_test"]);
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
        const passwordInput = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.EditText[2]');
        await passwordInput.click();
        await passwordInput.sendKeys(["fake@email.com"]);
        //Se asigna a la variable, el elemento del boton donde se realiza el inicio de sesión
        const buttonSubmit = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[1]');
        await buttonSubmit.click();
        await pauseClient(2000);
        await noAutoFillSave();
        try{
            //Se toma el elemento del mensaje de bienvenida para validar su aparición
            const field = await client.$('android=new UiSelector().textContains("Welcome")');
            const visible = await field.isDisplayed();
            assert(visible);
            //Se toma el texto del elemento para compararlo con el esperado
            const text = await field.getText();
            assert.equal(text, 'Welcome Back');
        }catch(error){
            console.log(error);
            //Se toma el elemento del mensaje del nombre del usuario para validar su aparición
            const field = await client.$('android=new UiSelector().textContains("pa_")');
            const visible = await field.isDisplayed();
            assert(visible);
            //Se toma el texto del elemento para compararlo con el esperado
            const text = await field.getText();
            assert.equal(text, 'pa_test');
        }
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
        //Se toma el elmento de tipo boton para omitir la pantalla inicial
        const field = await client.$('android=new UiSelector().text("SKIP")');
        const visible = await field.isDisplayed();
        assert(visible);
        await field.click();
    };