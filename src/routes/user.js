var express = require('express');
var router = express.Router();

// Importamos modelo user
import User from '../models/user';

const { verificarAuth, verificarAdmin } = require('../middlewares/autenticacion')

// Filtrar campos de PUT
const _ = require('underscore');

// Hash Contraseña
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Nuevo usuario
router.post('/nuevo-usuario', async (req, res) => {

    const body = {
        nombre: req.body.nombre,
        email: req.body.email,
        // pass: req.body.pass,
        role: req.body.role
    }

    body.pass = bcrypt.hashSync(req.body.pass, saltRounds);

    try {

        const userDB = await User.create(body);

        return res.json(userDB);

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ocurrio un error',
            error
        });
    }

});

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// Obtener datos de usuario por ID (PUT)
router.put('/usuario/:id', [verificarAuth, verificarAdmin], async (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'pass', 'activo']);

    if (body.pass) {
        body.pass = bcrypt.hashSync(req.body.pass, saltRounds);
    }

    try {
        // {new:true} nos devuelve el usuario actualizado
        const usuarioDB = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });

        return res.json(usuarioDB);

    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }

});

module.exports = router;