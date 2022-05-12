const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const app = express()

//seteamos el motor de plantilla
app.set('view engine', 'ejs')

//seteamos la carpeta public
app.use(express.static('public'))
    //para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//seteamos variables de entorno
dotenv.config({ path: './env/.env' })

//para poder trabajar con las cookies
app.use(cookieParser())

//llamar al router
app.use('/', require('./routes/router'))

//para eliminar cache y que no se pueda volver con el boton back luego del logaut

app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

//escuchar
app.listen(3000, () => {
    console.log('server up running in http://localhost:3000')
})