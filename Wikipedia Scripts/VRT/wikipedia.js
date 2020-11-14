//Se asignan las dependencias necesarias para correr el test y asÃ­ tomar los screenshots necesarios para hacer las pruebas VRT.
const wdio = require("webdriverio");
const assert = require("assert");
const path = require("path");
const { execSync } = require("child_process");
//Se asignan los atributos necesario para enviar al servidor de appium y de esta manera iniciar con las pruebas en la aplicaciÃ³n Wikipedia.
const opts = {
  port: 4723,
  path: "/wd/hub",
  capabilities: {
    platformName: "Android",
    platformVersion: "11",
    deviceName: "Nexus_5_API_30",
    app: "Ruta del apk",
    appPackage: "org.wikipedia.alpha",
    appActivity: "org.wikipedia.main.MainActivity",
  },
};
//AsignaciÃ³n de variables globales, necesarias en mÃºltiples funciones del programa.
let client;
let picture = 0;
let name = "Wikipedia";
let packageName = "org.wikipedia.alpha";

//FunciÃ³n principal que genera la orquestaciÃ³n de las demÃ¡s funciones que cumplen con los pasos para tomar pantallas de las funcionalidades seleccionadas en la app.
async function main(opts2) {
  opts.capabilities.deviceName = opts2.capabilities.deviceName;
  opts.capabilities.app = "/APK/app.apk";
  opts.hostname = opts2.hostname;
  //Se invoca el metodo para desinstalar la app.
  // uninstallApp();
  //Se crea el cliente de appium, pasando los parametros establecidos anteriormente.
  client = await wdio.remote(opts);
  //Se invoca el metodo para generar una pausa.
  await pauseClient(200);
  //Se invoca el metodo para tomar pantalla.
  await takeScreenshot();
  //Se asigna a la variable el elmento de tipo boton para saltar las configuraciones iniciales de la app.
  const button = await client.$('android=new UiSelector().text("SKIP")');
  await button.click();
  await takeScreenshot();
  //Se invocan las funciones que contienen los pasos para tomar pantallas de cada una de las funcionalidades seleccionadas en la app.
  await signUp();
  await logIn();
  await syncedRead();
  await editing();
  await shareToSocialMedia();
  await searchArticles();
  //Se generar la desconexiÃ³n del servidor de appium.
  await client.deleteSession();
}

//Se realiza la desinstalaciÃ³n de la aplicaciÃ³n en caso de estar ya instalada en el emulador seleccionado.
const uninstallApp = () => {
  try {
    execSync(`adb uninstall ${packageName}`);
  } catch (error) {
    console.log(error);
  }
};

//Se toma la pantalla y se guarda en la ubicaciÃ³n deseada.
const takeScreenshot = async () => {
  await client.saveScreenshot(
    path.join(__dirname, `/screenshots/${picture}.png`)
  );
  picture++;
};

//Se genera una pausa en el server para permitir cargar la pantalla en el emulador
const pauseClient = async (time) => {
  await client.pause(time);
};

//Se hace esta funciÃ³n con los pasos comunes para el login y signup.
const loginSignUpSteps = async () => {
  const buttonMore = await client.$('android=new UiSelector().text("More")');
  await buttonMore.click();
  await takeScreenshot();
  const buttonLoginSignUp = await client.$(
    'android=new UiSelector().textContains("LOG IN")'
  );
  await buttonLoginSignUp.click();
  await takeScreenshot();
};

//Se hace esta funciÃ³n con los pasos comunes para ir atrÃ¡s.
const goToHome = async () => {
  const buttonMore = await client.$(
    'android=new UiSelector().description("Navigate up")'
  );
  await buttonMore.click();
};

//Se hace esta funciÃ³n con los pasos comunes para ir a un articulo en el listado de guardados.
const goToArticle = async () => {
  const listsButton = await client.$(
    'android=new UiSelector().text("My lists")'
  );
  await listsButton.click();
  await takeScreenshot();
  const listButton = await client.$('android=new UiSelector().text("Saved")');
  await listButton.click();
  await takeScreenshot();
  await pauseClient(5000);
  const secondItem = await client.$$(
    'android=new UiSelector().className("android.view.ViewGroup")'
  );
  await secondItem[2].click();
  await pauseClient(1000);
  await takeScreenshot();
};

//Se hace esta funciÃ³n con los pasos para dar en el boto de no en el mensaje de autoguardado de usuario y contraseÃ±a.
const noAutoFillSave = async () => {
  try {
    const noButton = await client.$(
      'android=new UiSelector().resourceId("android:id/autofill_save_no")'
    );
    await noButton.click();
  } catch (error) {
    console.log(error);
  }
};

//Se hace esta funciÃ³n con los pasos comunes para dar en el boto de no en el mensaje de configuraciÃ³n de autofill.
const noSettingsAutoFill = async () => {
  try {
    const noButton = await client.$(
      'android=new UiSelector().resourceId("android:id/button2")'
    );
    await noButton.click();
  } catch (error) {
    console.log(error);
  }
};

//Se hace esta funciÃ³n con los pasos para buscar articulo en la app.
const searchArticles = async () => {
  //Se asigna a la variable, el elemento del boton donde redirecciona al home para buscar el articulo
  try {
    const homeButton = await client.$('android=new UiSelector().text("Home")');
    await homeButton.click();
    //Se maneja este caso el catch porque algunas ocasiones la app despliega esta opciÃ³n como Home y otras veces como Explore
  } catch (error) {
    console.log(error);
    const homeButton2 = await client.$(
      'android=new UiSelector().text("Explore")'
    );
    await homeButton2.click();
  }
  //Se asigna a la variable, el elemento del campo tipo input donde se activa por el click para buscar
  const searchButton = await client.$(
    'android=new UiSelector().text("Search Wikipedia")'
  );
  await searchButton.click();
  await takeScreenshot();
  //Se asigna a la variable, el elemento del campo tipo input donde se diligencia la palabra a buscar
  const searchInput = await client.$(
    'android=new UiSelector().text("Search Wikipedia")'
  );
  await searchInput.sendKeys(["Colombia"]);
  await pauseClient(1000);
  await takeScreenshot();
  //Se asigna a la variable, el elemento de tipo list, en donde se encuentran los resultados de los articulos buscados
  const firstItem = await client.$$(
    'android=new UiSelector().className("android.view.ViewGroup")'
  );
  //Se da click al primer articulo de la lista, en este caso el de Colombia.
  await firstItem[1].click();
  await pauseClient(1000);
  await takeScreenshot();
};

//Se hace esta funciÃ³n con los pasos para diligenciar de una manera correcta el usuario y contraseÃ±a
const logIn = async () => {
  //Se invoca el metodo que tiene los pasos para llevar al app hasta el formulario de registro.
  await loginSignUpSteps();
  //Se asigna a la variable, el elemento del boton login
  const buttonLogin = await client.$('android=new UiSelector().text("LOG IN")');
  await buttonLogin.click();
  await takeScreenshot();
  //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
  const usernameInput = await client.$(
    'android=new UiSelector().text("Username")'
  );
  await usernameInput.click();
  await usernameInput.sendKeys(["PruebasWiki123"]);
  //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
  const passwordInput = await client.$(
    'android=new UiSelector().text("Password")'
  );
  await passwordInput.click();
  await passwordInput.sendKeys(["WikiPass123"]);
  //Se asigna a la variable, el elemento del boton donde se realiza el inicio de sesiÃ³n
  const buttonSubmit = await client.$(
    'android=new UiSelector().text("LOG IN")'
  );
  await buttonSubmit.click();
  await takeScreenshot();
  await pauseClient(2000);
  //Se invoca el metodo para responder no a la pregunta de auto relleno de los datos
  await noAutoFillSave();
  //Se invoca el metodo para responder no a la pregunta de configuraciÃ³n de autofill.
  await noSettingsAutoFill();
  // await pauseClient(3000);
};

//Se hace esta funciÃ³n con los pasos para diligenciar la informaciÃ³n necesaria para registrar una nueva cuenta, en este caso se busca que los datos diligenciados estÃ©n errados.
const signUp = async () => {
  //Se invoca el metodo que tiene los pasos para llevar al app hasta el formulario de registro.
  await loginSignUpSteps();
  //Se asigna a la variable el elemento del campo tipo input donde se diligencia el nombre de usuario
  const usernameInput = await client.$(
    'android=new UiSelector().text("Username")'
  );
  await usernameInput.click();
  await usernameInput.sendKeys(["Pruebas"]);
  //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
  const passwordInput = await client.$(
    'android=new UiSelector().text("Password")'
  );
  await passwordInput.click();
  await passwordInput.sendKeys(["Pruebas"]);
  //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el password
  const repeatPasswordInput = await client.$(
    'android=new UiSelector().text("Repeat password")'
  );
  await repeatPasswordInput.click();
  await repeatPasswordInput.sendKeys(["Pruebas"]);
  //Se asigna a la variable, el elemento del campo tipo input donde se diligencia el email
  const emailInput = await client.$(
    'android=new UiSelector().textContains("Email")'
  );
  await emailInput.click();
  await emailInput.sendKeys(["Pruebas"]);
  //Se asigna a la variable, el elemento del boton donde se busca crear el registro
  const buttonSubmit = await client.$('android=new UiSelector().text("NEXT")');
  await buttonSubmit.click();
  //Se toma la pantalla
  await takeScreenshot();
  //Se invoca el metodo para volver al home
  await goToHome();
  //Se genera una pausa en el server para permitir cargar la pantalla en el emulador
  await pauseClient(1000);
  //Se invoca el metodo para responder no a la pregunta de auto relleno de los datos
  await noAutoFillSave();
};

//Se hace esta funciÃ³n con los pasos para ver la opciÃ³n de editar, como no se tienen articulos para editar se deja solo en la vista principal de esa funcionalidad.
const editing = async () => {
  //Se asigna a la variable, el elemento del boton donde se direcciona a la vista de editar.
  const editButton = await client.$('android=new UiSelector().text("Edits")');
  await editButton.click();
  await takeScreenshot();
};

//Se hace esta funciÃ³n con los pasos para ver la sincronizaciÃ³n de los articulos con el usuario logueado, lista guardados para este caso.
const syncedRead = async () => {
  //Se invoca el metodo para ingresar a un articulo.
  await goToArticle();
  await takeScreenshot();
  //Se usa el back desde el driver para volver atrÃ¡s en la app, a travÃ©s del boton del celular.
  await client.back();
  //Se invoca metodo de ir al home de la app.
  await goToHome();
};

const offlineRead = async () => {};

//Se hace esta funciÃ³n con los pasos compartir un articulo desde la app.
const shareToSocialMedia = async () => {
  //Se invoca el metodo para ingresar a un articulo.
  await goToArticle();
  //Se asigna a la variable, el elemento del boton donde se busca mostras las opciones.
  const optionsButton = await client.$(
    'android=new UiSelector().description("More options")'
  );
  await optionsButton.click();
  await takeScreenshot();
  //Se asigna a la variable, el elemento del boton compartir
  const shareButton = await client.$(
    'android=new UiSelector().resourceId("org.wikipedia.alpha:id/overflow_share")'
  );
  await shareButton.click();
  await takeScreenshot();
  //Se usa el back desde el driver para volver atrÃ¡s en la app, a travÃ©s del boton del celular.
  await client.back();
  await client.back();
  //Se invoca metodo de ir al home de la app.
  await goToHome();
};
module.exports = main;
