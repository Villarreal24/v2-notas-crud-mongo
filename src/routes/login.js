var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

// Importamos modelo User
import User from '../models/user';

// Hash Contraseña
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/', async(req, res) => {
    
    const body = req.body;

    try {

        // Evaluar el email
        const usuarioDB = await User.findOne({ email: body.email });
        
        if (!usuarioDB) {
            return res.status(400).json({
                mensaje: 'Email o contraseña incorrectas'
            });
        }

        // Evaluar la contraseña
        if (!bcrypt.compareSync(body.pass, usuarioDB.pass)) {
            return res.status(400).json({
                mensaje: 'Email o contraseña incorrectas'
            });
        }

        // Generar token
        const token = jwt.sign({
            data: usuarioDB
          }, 'secret', { expiresIn: 60 * 60 * 24 * 30 });

        res.json({
            usuarioDB,
            token
        })

    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        });
    }
});

module.exports = router;