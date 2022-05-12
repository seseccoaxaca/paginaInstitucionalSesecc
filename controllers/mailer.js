// exports.imprime = async(req, res) => {
//     console.log('llegue al ejemplo.js' + req.body.name)
// }


const nodemailer = require('nodemailer');

exports.enviacorreo = async(req, res) => {
    console.log(req.body)
    const { name, email, message } = req.body;

    contentHTML = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SESECC</title>
        <!-- CSS only -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&display=swap" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <style>
            h2 {
                color: #46AAA6;
            }
            
            p {
                color: rgb(120, 120, 120);
            }
            
            .cuadro {
                margin: 10px;
                border: 2px solid rgb(226, 226, 226);
                border-radius: 5px;
                margin: 0 auto;
            }
            
            .imagen {
                margin: 0 auto;
            }
            
            .contenido1 {
                margin: 0 10px;
                font-family: 'DM Sans', sans-serif;
            }
            
            .contenido {
                margin: 10px;
            }
        </style>
    </head>
    
    <body>
        <div class="cuadro" style="max-width: 300px;">
            <div class="imagen" style="max-width: 220px;"><img src="https://prueba.sidepoloax.com/img/SESECC_color.png" alt="sesecc" style="max-width: 220px"></div>
    
            <div class="contenido1">
                <h2>Envía tu mensaje</h2>
                <div class="contenido">
                    <p>Nombre: ${name}</p>
                    <p>Correo Electrónico: ${email}</p>
                    <p>Mensaje: ${message}</p>
                </div>
            </div>
    
    
    
        </div>
    </body>
    
    </html>`;

    //console.log(contentHTML);
    //aqui se debe configurar con el correo del hosting nuevo o con el gmail que se quiera usar
    const transporter = nodemailer.createTransport({
        host: 'mail.sidepoloax.com',
        port: 587,
        secure: false,
        auth: {
            user: 'sesecc@sidepoloax.com',
            pass: 's3s3cc2021'
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const info = await transporter.sendMail({
        from: "'Server SESECC' <sesecc@sidepoloax.com>",
        to: 'sesecc.gob@gmail.com',
        subject: 'website contact form',
        html: contentHTML
    });

    console.log('message send', info.messageId);
    //res.redirect('/success.html')
}