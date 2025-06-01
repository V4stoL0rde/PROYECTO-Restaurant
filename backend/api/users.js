const express = require("express");
const UserController2 = require("../controllers/users2");
var authorize = require('../controllers/permisos')


// API routes
const router = express.Router();

//solo agregar operarios o admin para postman
router.post('/nuevo-usuario',UserController2.addUser2);
//autenticar login 
router.post('/autenticate',UserController2.autUser2);
router.post('/nuevo',UserController2.verifyUser2);
router.post('/recuperate',UserController2.RecuperarCuenta);
router.post('/recuperate2',UserController2.RecuperarCuentaCodigo);
router.put('/editusuarios/:id',UserController2.actualizarUsuario);
router.get('/obtenerUser/:id', UserController2.obtenerUsuarioPorId);
router.delete('/usuarios/:id', UserController2.eliminarUsuarioConPassword);




module.exports = router;