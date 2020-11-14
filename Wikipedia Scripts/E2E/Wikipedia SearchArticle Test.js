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

describe("Search Article test", function() {

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

    it("Success search article ", async function() {
        //Se genera una pausa iniciar de la app
        await pauseClient(2000);
        //Se asigna el elemento boton para poder omitir la configuración inicial
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
        //Se toma el elemento de tipo boton para garantizar el ingreso al articulo
        const field = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/article_menu_bookmark")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se compara el texto del elemento con el esperado
        const text = await field.getText();
        assert.equal(text, "Save");
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