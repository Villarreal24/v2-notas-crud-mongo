var jwt = require('jsonwebtoken');

const verificarAuth = (req, res, next) => {

    const token = req.get('token');

    jwt.verify(token, 'secret', (err, decoded) => {

        if (err) {
            return res.status(401).json({
                mensaje: 'Usuario no valido',
            });
        }

        req.usuario = decoded.data;
        next();
    })
}

const verificarAdmin = (req, res, next) => {

    const rol = req.usuario.role

    if (rol === 'ADMIN') {
        next();
    } else {
        return res.status(401).json({
            mensaje: 'Usuario no valido',
        });
    }
}

module.exports = { verificarAuth, verificarAdmin }