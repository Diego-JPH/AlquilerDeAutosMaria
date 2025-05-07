const users = require('../../models/user'); //importa el array de la base de datos

exports.listUsers = (req, res) => { //crea y exporta una arrow function para usarse en otros archivos (routes)
    if (users.length === 0) { //verifica si la base de datos esta vacia
        return res.status(404).json({ message: 'No hay usuarios registrados' }); //si no hay usuarios devuelve un error 404
    }
    return res.status(200).json(users); //devuelve la lista de usuarios
}