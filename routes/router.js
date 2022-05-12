const express = require('express')
const router = express.Router()
const app = express();
const path = require('path')

const multer = require('multer');
const mimeTypes = require('mime-types');
const conexion = require('../database/db')
let fs = require('fs-extra');

const authController = require('../controllers/authController');
const { dirname } = require('path');

// router.get('/img', (req, res) => {
//     res.json(imagedir)
// })

// vistas de las pestañas
router.get('/', (req, res) => {
    conexion.query('SELECT * FROM noticias', (error, results) => {
        if (error) {
            throw error;

        } else {
            res.render('index', { results: results, l: results.length });
            //console.log('algo');
        }
    });
})

router.get('/plataformaDigital', (req, res) => {
    res.render('plataformaDigital')
})

router.get('/tratadosyComercios', (req, res) => {
    res.render('tratadosyComercios')
})

router.get('/ejemplo1', (req, res) => {
    conexion.query('SELECT * FROM noticias', (error, results) => {
        if (error) {
            throw error;

        } else {
            res.render('ejemplo1', { results: results, l: results.length });
            //console.log('algo');
        }
    });
})

router.get('/ejemplo', (req, res) => {
    res.render('main')
})

router.get('/ejemplo2', (req, res) => {
    res.render('ejemplo2')
})
router.get('/ejemplo3', (req, res) => {
    res.render('ejemplo5')
})

router.get('/cursos', (req, res) => {
    res.render('cursos')
})

router.get('/registerCapacitacion', (req, res) => {
    res.render('registerCapacitacion')
})

router.get('/loginCapacitacion', (req, res) => {
    res.render('loginCapacitacion', { alert: false })
})

router.get('/contacto', (req, res) => {
    res.render('contacto')
})

router.get('/quienes', (req, res) => {
    res.render('quienesSomos')
})

router.get('/integridadPublica', (req, res) => {
    res.render('integridadPublica')
});

router.get('/construccion', (req, res) => {
    res.render('construccion')
});
// router.get('/otro', (req, res) => {
//     res.render('otro/comite')
// })


//vista para paginas que acceden a bd
router.get('/saladPrensa', (req, res) => {
    conexion.query('SELECT * FROM noticias', (error, results) => {
        if (error) {
            throw error;

        } else {
            res.render('saladPrensa', { results: results, l: results.length });
            //console.log('algo');
        }
    });
})

router.get('/noticias2', (req, res) => {
    conexion.query('SELECT * FROM noticias', (error, results) => {
        if (error) {
            throw error;

        } else {
            res.render('noticias2', { results: results, l: results.length });
            //console.log('algo');
        }
    });
})


router.get('/transparencia', (req, res) => {
    conexion.query('SELECT * FROM transparencia', (error, results) => {
        if (error) {
            throw error;

        } else {
            res.render('transparencia', { results: results });
            //console.log('algo');
        }
    });
});

router.get('/informacionFinanciera', (req, res) => {
    conexion.query('SELECT * FROM informacionfinanciera', (error, results) => {
        if (error) {
            throw error;

        } else {
            res.render('informacionFinanciera', { results: results });
            //console.log('algo');
        }
    });
});

router.get('/marcoNormativo', (req, res) => {
    conexion.query('SELECT * FROM marconormativo', (error, results) => {
        if (error) {
            throw error;

        } else {
            res.render('marcoNormativo', { results: results });
            //console.log('algo');
        }
    });
});
router.get('/actas', (req, res) => {
    conexion.query('SELECT * FROM actas', (error, results) => {
        if (error) {
            throw error;

        } else {
            res.render('actas', { results: results });
        }
    });
});
//router para las vistas de paginas con autentificacion

router.get('/inicio', authController.isAuthenticated, (req, res) => {
    res.render('inicio', { user: req.user.name, alert: false })
});



router.get('/login', (req, res) => {
    res.render('login', { alert: false })
});

router.post('/registrar', authController.isAuthenticated1, (req, res) => {
    res.render('register')
});

router.get('/subirdocumento', authController.isAuthenticated, (req, res) => {
    res.render('subirpdf')
})


// router.get('/subir', authController.isAuthenticated, (req, res) => {
//     res.render('subir', { user: req.user.rol, alert: false })
// });

//--------adminnistrador------------------
router.get('/admin', authController.isAuthenticated1, (req, res) => {
    conexion.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error;

        } else {
            console.log(req.user.rol);
            if (req.user.rol === 'admin')
                res.render('admin', { results: results, user: req.user });
            else
                res.redirect('/inicio')
        }
    });
});

router.get('/data', (req, res) => {
    conexion.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error;

        } else {
            data = JSON.stringify(results);
            res.send(data);
        }
    });
});
router.get('/delete/:id', authController.isAuthenticated1, (req, res) => {
    const id = req.params.id;
    conexion.query('DELETE FROM users WHERE id =?', [id], (error, results) => {
        if (error) {
            throw error;

        } else {
            res.redirect('/admin');

        }
    })
})

router.get('/edit/:id', authController.isAuthenticated1, (req, res) => {
    const id = req.params.id;
    conexion.query('SELECT * FROM users WHERE id=?', [id], (error, results) => {
        if (error) {
            throw error;

        } else {
            res.render('edit', { user: results[0] });

        }
    })
})

router.post('/update', authController.update)

//--------adminnistrador de tablas------------------
router.get('/selectTable', authController.isAuthenticated1, (req, res) => {
    res.render('selectTable', { user: req.params.user })
})

router.post('/updateTables', authController.isAuthenticated1, (req, res) => {
    var tabla = req.body.tabla
    console.log(tabla)
    res.render(`tabla${tabla}`, { user: tabla });
});
router.get('/dataTable/:user', (req, res) => {
    const tabla = req.params.user;
    //console.log(tabla + 'en dataTable')
    conexion.query(`SELECT * FROM ${tabla}`, (error, results) => {
        if (error) {
            throw error;

        } else {
            data = JSON.stringify(results);
            res.send(data);
        }
    });
});
router.get('/dataTable2/:user', (req, res) => {
    const tabla = req.params.user;
    //console.log(tabla + 'en dataTable')
    conexion.query(`SELECT * FROM ${tabla}`, (error, results) => {
        if (error) {
            throw error;

        } else {
            data = JSON.stringify(results);
            res.send(data);
        }
    });
});
router.get('/delete1/:tabla/:id', authController.isAuthenticated, (req, res) => {
    const id = req.params.id;
    const tabla = req.params.tabla;
    conexion.query(`SELECT * FROM ${tabla} WHERE id = "${id}"`, (error, results) => {
        if (error) {
            throw error;

        } else {
            var ruta = results[0].ruta
            var file = results[0].archivo
            console.log(ruta + file)
            fs.unlinkSync("public/" + ruta + "/" + file);
            console.log('ya pase a eliminar')

        }
    })
    console.log(tabla + 'entre a delete1')
    conexion.query(`DELETE FROM ${tabla} WHERE id =?`, [id], (error, results) => {
        if (error) {
            throw error;

        } else {
            console.log('elimine en BD')
            res.redirect('/selectTable');

        }
    })

})

router.get('/edit1/:tabla/:id', authController.isAuthenticated1, (req, res) => {
    const tabla = req.params.tabla;
    const id = req.params.id;
    console.log('tabla' + tabla)
    conexion.query(`SELECT * FROM ${tabla} WHERE id=?`, [id], (error, results) => {
        if (error) {
            throw error;

        } else {
            res.render('editTable', { user: results[0] });

        }
    })
})

//------------------------------------------------------------------------------------------------


//----------------------------------esta funcion solo la ocupo para subir la descripcion de las fracciones
router.get('/ingresar', (req, res) => {
    res.render('ingresar')
})

router.post('/subirtexto', (req, res) => {
    var articulo = req.body.articulo
    var fraccion = req.body.fraccion
    var texto = req.body.texto
    console.log(articulo + fraccion + 'estoy en la funcion de ejemplo');
    conexion.query('INSERT INTO infofraccion SET ?', { fraccion: fraccion, articulo: articulo, texto: texto }, (error, results) => {
        if (error) { console.log(error + 'error en la conexion') }
        //res.redirect('/inicio')
        console.log(fraccion + ' agregado correctamente')
    });
    res.send(" El archivo se subio")
})

//direccionar archivos a directorio upload transparencia----------------------------------------------------------------------
storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var carpeta1 = req.body["articulo"]
        var carpeta2 = req.body["year"]
        var carpeta3 = req.body["fraccion"]
        var carpeta4 = req.body["inciso"]
        if (carpeta4 === 'null') {
            var ruta = `public/uploadsection/Transparencia/${carpeta1}/${carpeta2}/${carpeta3}`
        } else {
            var ruta = `public/uploadsection/Transparencia/${carpeta1}/${carpeta2}/${carpeta3}/${carpeta4}`
        }
        fs.mkdirsSync(ruta)
        cb(null, ruta);
    },
    filename: function(req, file, cb) {
        //cb("", file.originalname + "." + mimeTypes.extension(file.mimetype));
        cb("", file.originalname);
    }
});
//este no se ocupa corroborar
// var upload = multer({
//         storage: storage
//     })
//---------------
router.post("/files", multer({ storage: storage }).single('file'), function(req, res) {
    var boton = req.body["boton"];
    if (boton === 'Guardar') {
        authController.subirTransparencia(req, res)
    } else {
        if (req.file) {
            var ruta = req.body.ruta
            var anterior = req.body.archivoanterior
            fs.unlinkSync("public/" + ruta + "/" + anterior);
        }
        authController.updateTransparencia(req, res)
    }
});
//---------termina la funcion seccion donde subo archivos a ruta dinamica---------------------------------------------------------------

//-----empieza noticias
storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('estoy en storage noticias pdf')

        var ruta = `public/uploadsection/Noticias/pdf`

        fs.mkdirsSync(ruta)
        cb(null, ruta);
    },
    filename: function(req, file, cb) {
        //cb("", file.originalname + "." + mimeTypes.extension(file.mimetype));
        cb("", file.originalname);
    }
});

router.post("/subirpdf", multer({ storage: storage }).single('file'), function(req, res) {
    res.send('regresa y escribe esta ruta: uploadsection/Noticias/pdf/' + req.file.filename)
});


storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('estoy en storage noticias')
        var carpeta1 = req.body["fecha"]
            //var carpeta2 = req.body["titulo"]
        var carpeta3 = req.body["tiempo"]
        console.log('prueba:' + carpeta1 + ' ' + carpeta3)

        var ruta = `public/uploadsection/Noticias/img/${carpeta1}-${carpeta3}`

        fs.mkdirsSync(ruta)
        cb(null, ruta);
    },
    filename: function(req, file, cb) {
        //cb("", file.originalname + "." + mimeTypes.extension(file.mimetype));
        cb("", file.originalname);
    }
});

router.post("/noticias", multer({ storage: storage }).single('file'), function(req, res) {
    var boton = req.body["boton"];
    if (boton === 'Guardar') {
        authController.subirNoticias(req, res)
    } else {
        if (req.file) {
            var ruta = req.body.ruta
            var anterior = req.body.archivoanterior
            fs.unlinkSync("public/" + ruta + "/" + anterior);
        }
        authController.updateNoticias(req, res)
    }
});

//-----------termina noticias
//-----empieza actas----------------------------------------

storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('estoy en storage actas')
        var carpeta2 = req.body["unidad"]
        var ruta = `public/uploadsection/Actas/${carpeta2}`

        fs.mkdirsSync(ruta)
        cb(null, ruta);
    },
    filename: function(req, file, cb) {
        //cb("", file.originalname + "." + mimeTypes.extension(file.mimetype));
        cb("", file.originalname);
    }
});

router.post("/subirActas", multer({ storage: storage }).single('file'), function(req, res) {
    var boton = req.body["boton"];
    if (boton === 'Guardar') {
        authController.subirActas(req, res)
    } else {
        if (req.file) {
            var ruta = req.body.ruta
            var anterior = req.body.archivoanterior
            fs.unlinkSync("public/" + ruta + "/" + anterior);
        }
        authController.updateActas(req, res)
    }


});
//-----------termina actas---------------------------------------------------------------------------------------

//-----empieza marco normativo----------------------------------------

storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('estoy en storage marco')
        var carpeta2 = req.body["tipo"];
        var carpeta3 = req.body["descripcion"];

        var ruta = `public/uploadsection/Marco Normativo/${carpeta2}/${carpeta3}`

        fs.mkdirsSync(ruta)
        cb(null, ruta);
    },
    filename: function(req, file, cb) {
        //cb("", file.originalname + "." + mimeTypes.extension(file.mimetype));
        cb("", file.originalname);
    }
});

router.post("/subirMN", multer({ storage: storage }).array('file'), function(req, res) {
    var boton = req.body["boton"];
    if (boton === 'Guardar') {
        authController.subirMNormativo(req, res)
    } else {
        if (req.files) {
            var ruta = req.body.ruta
            var anterior1 = req.body.archivoanteriorword
                // fs.unlinkSync("public/" + ruta + "/" + anterior1);
                // var anterior2 = req.body.archivoanteriorpdf
                // fs.unlinkSync("public/" + ruta + "/" + anterior2);
        }
        authController.updateMNormativo(req, res)
    }


});

//-----------termina marco normativo---------------------------------------------------------------------------------------
//-------------informacion financiera----------------
storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('estoy en storage financiera')
        var carpeta1 = req.body["selecttipo"]
        var carpeta2 = req.body["year"]
        var carpeta3 = req.body["concepto"]
        var carpeta4 = req.body["trimestre"]
        console.log(carpeta1)

        var ruta = `public/uploadsection/Informacion Financiera/${carpeta1}/${carpeta2}/${carpeta3}/${carpeta4}`

        fs.mkdirsSync(ruta)
        cb(null, ruta);
    },
    filename: function(req, file, cb) {
        //cb("", file.originalname + "." + mimeTypes.extension(file.mimetype));
        cb("", file.originalname);
    }
});

router.post("/subirFinanciera", multer({ storage: storage }).single('file'), function(req, res) {
    var boton = req.body["boton"];
    if (boton === 'Guardar') {
        authController.subirFinanciera(req, res)
    } else {
        if (req.file) {
            var ruta = req.body.ruta
            var anterior = req.body.archivoanterior
            fs.unlinkSync("public/" + ruta + "/" + anterior);
        }
        authController.updateFinanciera(req, res)
    }

});
//termina informacion financiera------------------------------------------------------------------------------


//router para los metodos controller
router.post('/register', authController.register)
router.post('/login', authController.login)



router.post('/contactos', authController.contactos)

router.get('/logout', authController.logout)
router.post('/logout', authController.logout)


//esto lo pongo para que redirija al inicio en una ruta incorrecta
// router.get('/*', (req, res) => {
//     res.redirect('/');
// })

module.exports = router