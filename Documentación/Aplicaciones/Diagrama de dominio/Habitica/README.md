# Modelo de Habitica

En la carpeta model se encuentra el modelo de Habitica. Este modelo es usado para los servicios de la aplicación móvil y web

## Generación gráfica del modelo

1) Instalar el generador de edr con el comando: `npm i -g mongoose-erd-generator`
2) Ejecutar: `mongoose-erd-generator -p model -o habitica-model.svg -f svg`
3) El archivo creado `habitica-model.svg` contiene el modelo