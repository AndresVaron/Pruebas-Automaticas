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

describe("Share Article to Social Media test", function() {

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

    it("Share article without login ", async function() {
        //Se genera una pausa inicial de la app
        await pauseClient(2000);
        //Se toma el elemento para omitir la configuración inicial
        const button = await client.$('android=new UiSelector().text("SKIP")');
        await button.click();     
        //Se asigna a la variable, el elemento del campo tipo input donde se activa por el click para buscar
        const searchButton = await client.$('android=new UiSelector().text("Search Wikipedia")');
        await searchButton.click();
        //Se asigna a la variable, el elemento del campo tipo input donde se diligencia la palabra a buscar
        const searchInput = await client.$('android=new UiSelector().text("Search Wikipedia")');
        await searchInput.sendKeys(["Colombia"]);
        await pauseClient(1000);
        //Se asigna a la variable, el elemento de tipo list, en donde se encuentran los resultados de los articulos buscados
        const firstItem = await client.$$('android=new UiSelector().className("android.view.ViewGroup")');
        //Se da click al primer articulo de la lista, en este caso el de Colombia.
        await firstItem[1].click();
        await pauseClient(1000);
        //Se asigna a la variable, el elemento del boton donde se busca mostras las opciones.
        const optionsButton = await client.$('android=new UiSelector().description("More options")');
        await optionsButton.click();
        //Se asigna a la variable, el elemento del boton compartir
        const shareButton = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/overflow_share")');
        await shareButton.click();
        //Se toma el elemento del titulo para poder validar su aparición
        const field = await client.$('android=new UiSelector().resourceId("android:id/title")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se realiza la comparación del texto con lo esperado
        const text = await field.getText();
        assert.equal(text, "Share");
      });

    it("Share article with login and saved list ", async function() {
        //Se genera una pausa iniciar de la app
        await pauseClient(2000);
        //Se toma el elemento para omitir la configuración inicial
        const button = await client.$('android=new UiSelector().text("SKIP")');
        await button.click(); 
        //Se reaizan los pasos para generar el login exitoso en la app
        const buttonMore = await client.$('android=new UiSelector().text("More")');
        await buttonMore.click();
        //Se toma el elemento para ir a la pantalla de login o signup
        const buttonLoginSignUp = await client.$('android=new UiSelector().textContains("LOG IN")');
        await buttonLoginSignUp.click();
        await pauseClient(1000);
        //Se asigna a la variable, el elemento del boton login
        const buttonLogin = await client.$('android=new UiSelector().text("LOG IN")');
        await buttonLogin.click();
        //Se toma el elemento para digitar el username
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
        //Se asigna a la variable, el elemento del boton para ir a la pantalla de listas
        const listsButton = await client.$('android=new UiSelector().text("My lists")');
        await listsButton.click();
        //Se asigna a la variable, el elemento del boton para ir a la lista Saved
        const listButton = await client.$('android=new UiSelector().text("Saved")');
        await listButton.click();
        await pauseClient(5000);
        //Se asigna a la variable, el elemento del boton para tomar los articulos de la lista.
        const secondItem = await client.$$('android=new UiSelector().className("android.view.ViewGroup")');
        await secondItem[2].click();
        await pauseClient(1000);
        //Se asigna a la variable, el elemento del boton donde se busca mostras las opciones.
        const optionsButton = await client.$('android=new UiSelector().description("More options")');
        await optionsButton.click();
        //Se asigna a la variable, el elemento del boton compartir
        const shareButton = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/overflow_share")');
        await shareButton.click();
        //Se asigna a la variable, el elemento titulo para validar su existencia.
        const field = await client.$('android=new UiSelector().resourceId("android:id/title")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se valida que ese elemento contenga el texto esperado.
        const text = await field.getText();
        assert.equal(text, "Share");
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

    // //Se hace esta función con los pasos para dar en el boto de no en el mensaje de autoguardado de usuario y contraseña.
    const noAutoFillSave = async () => {
        try {
            const noButton = await client.$('android=new UiSelector().resourceId("android:id/autofill_save_no")');
            await noButton.click();
        } catch (error) {
            console.log(error);
        }
    };
    
    //Se genera una pausa en el server para permitir cargar la pantalla en el emulador
    const pauseClient = async (time) => {
        await client.pause(time);
    };