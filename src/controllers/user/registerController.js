const users = require('../../models/user'); //importa el array de la base de datos

exports.registerUser = (req, res) => { //crea y exporta una arrow function para usarse en otros archivos (routes)
    const { name, email, password } = req.body; //desestructura el body de la peticion para obtener los datos del usuario 
    if (!name || !email || !password) { //verificaciones basicas
        return res.status(400).json({ message: 'Todos los campos son obligatorios' }); //si no se cumplen las condiciones devuelve un error 400
    }
    const userExists = users.find((user) => user.email === email); //busca si el usuario existe con una arrow function
    if (userExists) {
        return res.status(400).json({ message: 'El usuario ya existe' }); //si el usuario ya existe devuelve un error 400
    }
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser); //lo almacena en la base de datos (cambiarlo cuando se haya implementado la base de datos)
    return res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser }); //devuelve un mensaje de exito y el usuario creado
}   