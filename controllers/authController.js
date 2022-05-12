const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')
const mailer = require('../controllers/mailer');


//const { use } = require('../routes/router')

//procesamiento para registrarnos
exports.register = async(req, res) => {


    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass
        const rol = req.body.rol
        let passHash = await bcryptjs.hash(pass, 8)

        conexion.query('INSERT INTO users SET ?', { user: user, name: name, pass: passHash, rol: rol }, (error, results) => {
            if (error) { console.log(error + 'error en la conexion') }
            res.redirect('/admin')
            console.log(name + user + pass + ' agregado correctamente')
        })
    } catch (error) {
        console.log('error catch')
    }
}

exports.registerAlumno = async(req, res) => {
    console.log('estoy en alumnoscap')

    try {
        const nombre = req.body.nombre
        const apellidos = req.body.apellidos
        const pass = req.body.pass
        const correo = req.body.correo
        const dependencia = req.body.dependencia
        const codigo = req.body.codigo
        const user = req.body.user
            //        let passHash = await bcryptjs.hash(pass, 8)
        let passHash = pass

        conexion.query('INSERT INTO alumnoscap SET ?', { nombre: nombre, apellidos: apellidos, correo: correo, dependencia: dependencia, codigo: codigo, user: user, pass: passHash }, (error, results) => {
            if (error) { console.log(error + 'error en la conexion') }
            res.redirect('/loginCapacitacion')
            console.log(user + ' agregado correctamente')
        })
    } catch (error) {
        console.log('error catch')
    }
}






exports.update = async(req, res) => {
    try {
        const id = req.body.id
        const user = req.body.user
        const name = req.body.name
        const rol = req.body.rol
        const pass = req.body.pass
        let passHash = await bcryptjs.hash(pass, 8)
        if (pass === '') {
            console.log('contraseña vacia')
            conexion.query('UPDATE users SET ? WHERE id = ?', [{ user: user, name: name, rol: rol }, id], (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.redirect('/admin');
                }
            })
        } else {
            conexion.query('UPDATE users SET ? WHERE id = ?', [{ user: user, name: name, rol: rol, pass: passHash }, id], (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.redirect('/admin');
                }
            })
        }
    } catch (error) {
        console.log('error catch')
    }

}

exports.contactos = async(req, res) => {
    mailer.enviacorreo(req, res);
    try {
        const name = req.body.name
        const correo = req.body.email
        const mensaje = req.body.message


        conexion.query('INSERT INTO contacto SET ?', { nombre: name, correo: correo, mensaje: mensaje }, (error, results) => {
            if (error) { console.log(error + 'error en la conexion') }
            res.redirect('/contacto')
            console.log(name + ' agregado correctamente')
        })
    } catch (error) {
        console.log('error catch')
        res.redirect('/contacto')
    }
}



//controlador para enviar archivos
exports.subirTransparencia = async(req, res) => {
    try {
        var usuario = req.body.user
        if (usuario === 'Unidad de Transparencia') {
            var user = req.body.selectunidad
        } else {
            var user = usuario
        }
        console.log(user)
        if (!req.file) {
            res.render('inicio', {
                user: user,
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'no hay archivo',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inicio'

            })
        } else {
            var articulo = req.body.articulo
            var fraccion = req.body.fraccion
            var year = req.body.year
            var aplica = req.body.aplica
            var inciso = req.body.inciso
            var seccion = req.body.seccion
            var file = req.file.filename;

            if (inciso === 'null') {
                var ruta = `uploadsection/${seccion}/${articulo}/${year}/${fraccion}`
                inciso = ''
            } else {
                var ruta = `uploadsection/${seccion}/${articulo}/${year}/${fraccion}/${inciso}`
            }

            conexion.query(`SELECT * FROM infofraccion WHERE fraccion = "${fraccion}"`, (error, results) => {
                if (error) {
                    console.log('entre a la funcion error')
                    throw error;
                } else {
                    var parrafo = 'todavia no hay descripcion';
                    parrafo = results[0].texto
                    conexion.query('INSERT INTO transparencia SET ?', { fraccion: fraccion, parrafo: parrafo, articulo: articulo, aplica: aplica, year: year, archivo: file, ruta: ruta, user: user, inciso: inciso, seccion: seccion }, (error, results) => {
                        if (error) { console.log(error + 'error en la conexion') }

                        console.log(fraccion + ' agregado correctamente')
                    })

                }
            });


            res.render('inicio', {
                user: user,
                alert: true,
                alertTitle: 'Informacion enviada correctamente',
                alertMessage: 'Puede subir mas archivos desde este usuario o salir',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 800,
                ruta: 'inicio'

            })
        }
    } catch (error) {
        console.log(error)
    }

}

exports.subirActas = async(req, res) => {
    try {
        var user = req.body.user
        if (!req.file) {
            res.render('inicio', {
                user: user,
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'no hay archivo',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inicio'

            })
        } else {
            var unidad = req.body.unidad
            var sesion = req.body.sesion
            var year = req.body.year
            var descripcion = req.body.descripcion
            var fecha = req.body.fecha
            var seccion = req.body.seccion
            var file = req.file.filename;
            var ruta = `uploadsection/${seccion}/${unidad}`
            conexion.query('INSERT INTO actas SET ?', { seccion: seccion, unidad: unidad, sesion: sesion, year: year, fecha: fecha, descripcion: descripcion, archivo: file, ruta: ruta, user: user }, (error, results) => {
                if (error) { console.log(error + 'error en la conexion') }
                //res.redirect('/inicio')
                console.log(' agregado correctamente')
            })
            res.render('inicio', {
                user: user,
                alert: true,
                alertTitle: 'Informacion enviada correctamente',
                alertMessage: 'Puede subir mas archivos desde este usuario o salir',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 800,
                ruta: 'inicio'

            })
        }
    } catch (error) {
        console.log(error)
    }

}

exports.subirMNormativo = async(req, res) => {
    try {
        var tipo = req.body.tipo
        var user = req.body.user
        if (!req.files) {
            res.render('inicio', {
                user: user,
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'no hay archivo',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inicio'

            })
        } else {
            console.log('entre al else de subir normativo')
            var descripcion = req.body.descripcion
            var fecha = req.body.fecha
            var reforma = req.body.reforma
            if (reforma.length === 2) {
                reforma = reforma[1];
            }
            console.log(reforma + 'final')
            var pdf = '',
                word = '';
            var seccion = req.body.seccion
            var file = req.files;
            console.log(file)
            if (file.length > 1) {
                const docType1 = file[0].mimetype;
                const docType2 = file[1].mimetype;
                if (docType1 === 'application/pdf') {
                    pdf = file[0].filename
                    word = file[1].filename
                } else if (docType2 === 'application/pdf') {
                    pdf = file[1].filename
                    word = file[0].filename
                }

            } else {
                if (file[0].mimetype === 'application/pdf') {
                    pdf = file[0].filename
                } else {
                    word = file[0].filename
                }
            }





            // var archivo = req.file.filename;
            var ruta = `uploadsection/${seccion}/${tipo}/${descripcion}`
            conexion.query('INSERT INTO marconormativo SET ?', { seccion: seccion, tipo: tipo, descripcion: descripcion, publicacion: fecha, reforma: reforma, pdf: pdf, word: word, ruta: ruta, user: user }, (error, results) => {
                if (error) { console.log(error + 'error en la conexion') }
                //res.redirect('/inicio')
                console.log(' agregado correctamente')
            })
            res.render('inicio', {
                user: user,
                alert: true,
                alertTitle: 'Informacion enviada correctamente',
                alertMessage: 'Puede subir mas archivos desde este usuario o salir',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 800,
                ruta: 'inicio'

            })
        }
    } catch (error) {
        console.log(error)
    }

}

exports.subirNoticias = async(req, res) => {
    try {
        var user = req.body.user
        if (!req.file) {
            res.render('inicio', {
                user: user,
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'no hay archivo',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inicio'

            })
        } else {

            var titulo = req.body.titulo
            var contenido = req.body["contenido"];
            var link = req.body.link
            var fecha = req.body.fecha
            var hora = req.body.tiempo
            var seccion = req.body.seccion
            var file = req.file.filename;


            var ruta = `uploadsection/${seccion}/img/${fecha}-${hora}`
            conexion.query('INSERT INTO noticias SET ?', { titulo: titulo, contenido: contenido, link: link, fecha: fecha, hora: hora, archivo: file, ruta: ruta, user: user, seccion: seccion }, (error, results) => {
                if (error) { console.log(error + 'error en la conexion') }
                console.log(' agregado correctamente')
            })
            res.render('inicio', {
                user: user,
                alert: true,
                alertTitle: 'Informacion enviada correctamente',
                alertMessage: 'Puede subir mas archivos desde este usuario o salir',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 800,
                ruta: 'inicio'

            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.subirFinanciera = async(req, res) => {
    try {
        var user = req.body.user
        if (!req.file) {
            res.render('inicio', {
                user: user,
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'no hay archivo',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inicio'

            })
        } else {

            var tipo = req.body.selecttipo
            var presupuestaria = req.body.presu
            var year = req.body.year
            var trimestre = req.body.trimestre
            var concepto = req.body.concepto
            var seccion = req.body.seccion
            var file = req.file.filename;
            var ruta = `uploadsection/${seccion}/${tipo}/${year}/${concepto}/${trimestre}`
            conexion.query('INSERT INTO informacionfinanciera SET ?', { tipo: tipo, year: year, trimestre: trimestre, concepto: concepto, presupuestaria: presupuestaria, archivo: file, ruta: ruta, user: user, seccion: seccion }, (error, results) => {
                if (error) { console.log(error + 'error en la conexion') }
                console.log(' agregado correctamente')
            })
            res.render('inicio', {
                user: user,
                alert: true,
                alertTitle: 'Informacion enviada correctamente',
                alertMessage: 'Puede subir mas archivos desde este usuario o salir',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 800,
                ruta: 'inicio'

            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.updateTransparencia = (req, res) => {
    var id = req.body.id

    var articulo = req.body.articulo
    var fraccion = req.body.fraccion
    var year = req.body.year
    var aplica = req.body.aplica
    var inciso = req.body.inciso
    var parrafo = req.body.parrafo
        //var ruta = req.body.ruta
    var user = req.body.selectunidad

    if (!req.file) {
        conexion.query('UPDATE transparencia SET ? WHERE id = ?', [{ fraccion: fraccion, parrafo: parrafo, articulo: articulo, aplica: aplica, year: year, inciso: inciso, user: user }, id], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log('actualizado');
            }
        })
    } else {
        var file = req.file.filename;
        if (inciso === 'null') {
            var ruta = `uploadsection/Transparencia/${articulo}/${year}/${fraccion}`
            inciso = ''
        } else {
            var ruta = `uploadsection/Transparencia/${articulo}/${year}/${fraccion}/${inciso}`
        }

        conexion.query('UPDATE transparencia SET ? WHERE id = ?', [{ fraccion: fraccion, parrafo: parrafo, articulo: articulo, aplica: aplica, year: year, inciso: inciso, archivo: file, ruta: ruta, user: user }, id], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log('actualizado');
            }
        })
    }
    res.render('inicio', {
        user: user,
        alert: true,
        alertTitle: 'Informacion actualizada correctamente',
        alertMessage: 'Puede seguir editando',
        alertIcon: 'success',
        showConfirmButton: false,
        timer: 800,
        ruta: 'selectTable'

    })
}

exports.updateFinanciera = (req, res) => {
    var id = req.body.id
    var tipo = req.body.selecttipo
    var year = req.body.year
    var trimestre = req.body.trimestre
    var concepto = req.body.concepto
    var user = req.body.user

    if (!req.file) {
        conexion.query('UPDATE informacionfinanciera SET ? WHERE id = ?', [{ tipo: tipo, year: year, trimestre: trimestre, concepto: concepto }, id], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log('actualizado');
            }
        })
    } else {
        var ruta = `uploadsection/Informacion Financiera/${tipo}/${year}/${concepto}/${trimestre}`
        var file = req.file.filename;
        conexion.query('UPDATE informacionfinanciera SET ? WHERE id = ?', [{ tipo: tipo, year: year, trimestre: trimestre, concepto: concepto, archivo: file, ruta: ruta }, id], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log('actualizado');
            }
        })
    }
    res.render('inicio', {
        user: user,
        alert: true,
        alertTitle: 'Informacion actualizada correctamente',
        alertMessage: 'Puede seguir editando',
        alertIcon: 'success',
        showConfirmButton: false,
        timer: 800,
        ruta: 'selectTable'

    })
}

exports.updateNoticias = (req, res) => {
    var id = req.body.id
    var titulo = req.body.titulo
    var contenido = req.body.contenido
    var link = req.body.link
    var fecha = req.body.fecha
    var user = req.body.user
    var anterior = req.body.archivoanterior

    if (!req.file) {
        conexion.query('UPDATE noticias SET ? WHERE id = ?', [{ titulo: titulo, contenido: contenido, link: link, fecha: fecha }, id], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log('actualizado' + anterior);
            }
        })
    } else {
        var file = req.file.filename;
        //var ruta = `uploadsection/${seccion}/img/${fecha}/${titulo}`
        conexion.query('UPDATE noticias SET ? WHERE id = ?', [{ titulo: titulo, contenido: contenido, link: link, fecha: fecha, archivo: file }, id], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log('actualizado' + anterior);
                // fs.unlinkSync("public/" + ruta + "/" + file);
            }
        })
    }
    res.render('inicio', {
        user: user,
        alert: true,
        alertTitle: 'Informacion actualizada correctamente',
        alertMessage: 'Puede seguir editando',
        alertIcon: 'success',
        showConfirmButton: false,
        timer: 800,
        ruta: 'selectTable'

    })
}

exports.updateMNormativo = (req, res) => {
    var id = req.body.id
    var tipo = req.body.tipo
    var descripcion = req.body.descripcion
    var fecha = req.body.fecha
    var reforma = req.body.reforma
    var user = req.body.user
    var ruta = req.body.ruta

    if (!req.file) {
        conexion.query('UPDATE marconormativo SET ? WHERE id = ?', [{ tipo: tipo, descripcion: descripcion, publicacion: fecha, reforma: reforma }, id], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log('actualizado');
            }
        })
    } else {

        var pdf = '',
            word = '';

        var file = req.files;
        console.log(file)
        if (file.length > 1) {
            const docType1 = file[0].mimetype;
            const docType2 = file[1].mimetype;
            if (docType1 === 'application/pdf') {
                pdf = file[0].filename
                word = file[1].filename
            } else if (docType2 === 'application/pdf') {
                pdf = file[1].filename
                word = file[0].filename
            }

        } else {
            if (file[0].mimetype === 'application/pdf') {
                pdf = file[0].filename
            } else {
                word = file[0].filename
            }
        }

        //var file = req.file.filename;
        var ruta = `uploadsection/Marco Normativo/${tipo}/${descripcion}`
        console.log('nueva tuta' + ruta)
        conexion.query('UPDATE marconormativo SET ? WHERE id = ?', [{ tipo: tipo, descripcion: descripcion, publicacion: fecha, reforma: reforma, pdf: pdf, word: word, ruta: ruta }, id], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log('actualizado');
            }
        })
    }
    res.render('inicio', {
        user: user,
        alert: true,
        alertTitle: 'Informacion actualizada correctamente',
        alertMessage: 'Puede seguir editando',
        alertIcon: 'success',
        showConfirmButton: false,
        timer: 800,
        ruta: 'selectTable'

    })
}

exports.updateActas = (req, res) => {
        var id = req.body.id
        var unidad = req.body.unidad
        var sesion = req.body.sesion
        var year = req.body.year
        var descripcion = req.body.descripcion
        var fecha = req.body.fecha
        var user = req.body.user
        var ruta = req.body.ruta


        if (!req.file) {
            conexion.query('UPDATE actas SET ? WHERE id = ?', [{ unidad: unidad, sesion: sesion, year: year, fecha: fecha, descripcion: descripcion }, id], (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('actualizado');
                }
            })
        } else {

            var file = req.file.filename;
            console.log(ruta + ' cambaindo la ruta en el aut')
            ruta = `uploadsection/Actas/${unidad}`
            console.log(ruta)
            conexion.query('UPDATE actas SET ? WHERE id = ?', [{ unidad: unidad, sesion: sesion, year: year, fecha: fecha, descripcion: descripcion, archivo: file, ruta: ruta }, id], (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('actualizado');
                }
            })
        }
        res.render('inicio', {
            user: user,
            alert: true,
            alertTitle: 'Informacion actualizada correctamente',
            alertMessage: 'Puede seguir editando',
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'selectTable'

        })
    }
    //----------------------------------------------------------------------------------------------------------------------
exports.login = async(req, res) => {
    try {
        const user = req.body.user
        const pass = req.body.pass

        //console.log(user + pass + rol)
        if (!user || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'ingresa un usuario y contraseña',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'

            })
        } else {
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async(error, results) => {
                //verificamos el rol de cada usuario


                if (results.length == 0 || user !== results[0].user || !(await bcryptjs.compare(pass, results[0].pass))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: 'Advertencia',
                        alertMessage: 'ingresa un usuario y contraseña correctos',
                        alertIcon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'

                    })
                } else {
                    const rol = results[0].rol
                    console.log('login' + rol)
                    if (rol == 'admin') {
                        direc = 'admin'
                    } else if (rol == 'capacitacion') {
                        console.log('cap')
                        direc = 'inicioCapacitacion'
                    } else {
                        direc = 'inicio'
                    }

                    //inicio de sesion ok
                    const id = results[0].id
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                            expiresIn: process.env.JWT_TIEMPO_EXPIRA
                        })
                        //generamos el token sin fecha de expiracion
                        //const token = jwt.sign({id:id},process.env.JWT_SECRETO)
                        // console.log("TOKEN: " + token + "para el usuario" + user)

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login', {
                        alert: true,
                        alertTitle: 'conexion exitosa',
                        alertMessage: 'login correcto',
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: direc
                    })
                } // termina else
            })
        }
    } catch (error) {
        console.log(error)

    }
}




exports.isAuthenticated = async(req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                    //console.log('\n resultados que envie a inicio', results)
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login')

    }
}

exports.isAuthenticated1 = async(req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                    //console.log('\n resultados que envie a inicio', results)
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login')

    }
}


exports.logout = (req, res) => {
    //console.log('if')
    res.clearCookie('jwt')


    //return res.redirect('admin')


    var rol = req.body.user
    console.log('estoy en logout authcontroler ' + rol)
    if (rol === 'admin') {
        // res.clearCookie('jwt')
        console.log('if')
        return res.redirect('/admin')
    } else {
        console.log('estoy en else')
            //res.clearCookie('jwt')
        return res.redirect('/inicio')
    }



}