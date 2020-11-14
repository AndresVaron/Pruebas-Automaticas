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

describe("Editing test", function() {

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

    it("Add article description without save it ", async function() {
        //Se genera una pausa inicial de la app
        await pauseClient(2000);
        //Se invoca la función de los pasos a seguir para llegar a la función Edits
        await editSteps();
        //Se invoca el UiScrollable para que baje hasta donde esta el elemento Article descriptioons
       await client.$('android=new UiScrollable(new UiSelector().resourceId(\"org.wikipedia.alpha:id/tasksContainer")).scrollIntoView(new UiSelector().text(\"Image captions"));');
        await pauseClient(3000);
        //Se maneja un posible error por activación de notificación del login de Wikipedia.
        try {
            //Se asigna el elemento del buton para ir a crear la descripción del articulo.
            const addButton = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/androidx.viewpager.widget.ViewPager/androidx.recyclerview.widget.RecyclerView/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.ScrollView/android.widget.FrameLayout/android.widget.LinearLayout/androidx.recyclerview.widget.RecyclerView/androidx.cardview.widget.CardView[1]/android.view.ViewGroup/android.widget.Button[1]');
            await addButton.click();
        } catch (error) {
            //Se registra el error
            console.log(error);
            //Se asume que el error fue por la notificación por lo que se da atrás en la app
            client.back();
            //Se vuelve a realizar todos los pasos de busqueda y abrir la creación de la descripción del articulo.
            await client.$('android=new UiScrollable(new UiSelector().resourceId(\"org.wikipedia.alpha:id/tasksContainer")).scrollIntoView(new UiSelector().text(\"Image captions"));');
            const addButton = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/androidx.viewpager.widget.ViewPager/androidx.recyclerview.widget.RecyclerView/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.ScrollView/android.widget.FrameLayout/android.widget.LinearLayout/androidx.recyclerview.widget.RecyclerView/androidx.cardview.widget.CardView[1]/android.view.ViewGroup/android.widget.Button[1]');
            await addButton.click();
        }
        //Se asigna a la variable, el elemento del boton para adicionar la descripción
        const addDescButton = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/addContributionButton")');
        await addDescButton.click();
        await pauseClient(1000);
        //Se adiciona el elemento que se validara para comprobar que los pasos fueron exitosos.
        const field = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/view_description_edit_header")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se valida el texto de la pantall con el esperado.
        const text = await field.getText();
        assert.equal(text, "Add article description");
      });

    it("Add image caption without save it ", async function() {
        //Se genera una pausa inicial de la app
        await pauseClient(2000);
        //Se invoca la función de los pasos a seguir para llegar a la función Edits
        await editSteps();
        //Se invoca el UiScrollable para que baje hasta donde esta el elemento Image captions
        await client.$('android=new UiScrollable(new UiSelector().resourceId(\"org.wikipedia.alpha:id/tasksContainer")).scrollIntoView(new UiSelector().text(\"Image captions"));');
        await pauseClient(3000);
        //Se maneja un posible error por activación de notificación del login de Wikipedia.
        try {
            //Se asigna a la variable el elemento del boton add donde se puede adicionar una captura de imagen
            const addButton = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/androidx.viewpager.widget.ViewPager/androidx.recyclerview.widget.RecyclerView/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.ScrollView/android.widget.FrameLayout/android.widget.LinearLayout/androidx.recyclerview.widget.RecyclerView/androidx.cardview.widget.CardView[2]/android.view.ViewGroup/android.widget.Button[1]');
            await addButton.click();
        } catch (error) {
            //Se registra el error
            console.log(error);
            //Se asume que el error fue por la notificación por lo que se da atrás en la app
            client.back();
            //Se vuelve a realizar todos los pasos de busqueda y abrir la creación de la descripción del articulo.
            await client.$('android=new UiScrollable(new UiSelector().resourceId(\"org.wikipedia.alpha:id/tasksContainer")).scrollIntoView(new UiSelector().text(\"Image captions"));');
            await pauseClient(3000);
            //Se asigna a la variable el elemento del boton add donde se puede adicionar una captura de imagen
            const addButton = await client.$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/androidx.viewpager.widget.ViewPager/androidx.recyclerview.widget.RecyclerView/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.ScrollView/android.widget.FrameLayout/android.widget.LinearLayout/androidx.recyclerview.widget.RecyclerView/androidx.cardview.widget.CardView[2]/android.view.ViewGroup/android.widget.Button[1]');
            await addButton.click();
        }
        //Se asigna a la variable, el elemento del boton para adicionar una captura de imagen.
        const addCaptionButton = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/addContributionButton")');
        await addCaptionButton.click();
        await pauseClient(2000);
        //Se adiciona el elemento que se validara para comprobar que los pasos fueron exitosos.
        const field = await client.$('android=new UiSelector().resourceId("org.wikipedia.alpha:id/view_description_edit_header")');
        const visible = await field.isDisplayed();
        assert(visible);
        //Se valida el texto de la pantall con el esperado.
        const text = await field.getText();
        assert.equal(text, "Add image caption");
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

    //Se hace esta función con los pasos comunes para el login y abrir Edits.
    const editSteps = async () => {
        //Se asigna a la variable el elmento de tipo boton para saltar las configuraciones iniciales de la app.
        const button = await client.$('android=new UiSelector().text("SKIP")');
        await button.click();
        await pauseClient(1000);
        //Se asigna a la variable el elmento de tipo boton para abrir las opciones adicionales.
        const buttonMore = await client.$('android=new UiSelector().text("More")');
        await buttonMore.click();
        //Se asigna a la variable el elmento de tipo boton para ir a login.
        const buttonLoginSignUp = await client.$('android=new UiSelector().textContains("LOG IN")');
        await buttonLoginSignUp.click();
        await pauseClient(1000);
        //Se asigna a la variable, el elemento del boton login
        const buttonLogin = await client.$('android=new UiSelector().text("LOG IN")');
        await buttonLogin.click();
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
        //Se da la instrucción para ir a la sección de Edits
        const buttonEdit = await client.$('android=new UiSelector().text("Edits")');
        await buttonEdit.click();
    };