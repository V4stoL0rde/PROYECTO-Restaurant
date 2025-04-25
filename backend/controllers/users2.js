const mongoose = require("mongoose");
const User2 = require("../models/User2");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// Función para enviar correo electrónico
const sendEmail = (email, subject, message) => {
  const transporter = nodemailer.createTransport({
   host:"smtp.gmail.com",
   port:465,
   secure:true,
    auth: {
      user: 'restaurante.ulagos@gmail.com', // Reemplaza con tu correo electrónico de Gmail
      pass: 'tacy uycg eszo tdjj' // Reemplaza con tu contraseña de Gmail
    }
  });

  const mailOptions = {
    from: 'restaurante.ulagos@gmail.com', // Reemplaza con tu correo electrónico de Gmail
    to: email,
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });
};
const email = 'restaurante.ulagos@gmail.com';
// Función para agregar nuevo usuario
const userVerificationCodes = {}; // Objeto para almacenar los códigos de verificación por usuario

const addUser2 = (req, res) => {
  const code = Math.floor(Math.random() * 90000) + 10000; // Genera un código de 5 dígitos
  console.log(req.body);
  
  let user2 = new User2({
    correo: req.body.correo,
    Username: req.body.Username,
    password: req.body.password,
    role:req.body.role
  });

  user2.save((err, user) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      // Envía correo electrónico al nuevo usuario con el código

      if (user.role[0] === 'CLIENTE') {
        sendEmail(user.correo, 'Código de verificación para registrarse', `Tu código de verificación es ${code}. Úsalo para completar tu registro en nuestra aplicación.`);
      }

      else {
        if(user.role[0] === 'TRABAJADOR'){
        sendEmail(user.correo, 'Código de verificación para registrarse', `hable con el administrador para obtener su codigo de verificacion.`);
        sendEmail(email, 'Código de verificación para registrarse', `código de verificación es ${code}.`);

      }
      } 
      
      
      const date = new Date();
      date.setHours(date.getHours() - 4);
      userVerificationCodes[req.body.Username] = { code: code, sentTime: date ,failedAttempts: 0 };
  
      res.status(200).json(user);
      
    }
  });
  
};

const verifyUser2 = (req, res) => { 
  const code = req.body.code;
  const username = req.body.Username;
  const date = new Date();
  date.setHours(date.getHours() - 4); // Ajuste de zona horaria
  
  if (!userVerificationCodes[username]) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const { code: sentCode, sentTime } = userVerificationCodes[username];

  // Convierte sentCode a string porque llega como objeto
  const sentCodeString = sentCode.toString();
  const codeString = code.toString(); // Asegura que code sea una cadena

  // Verifica si el código enviado coincide con el original y si no ha pasado demasiado tiempo
  if (sentCodeString === codeString && (date - sentTime) <= 600000) {
    // Verificación exitosa, actualizar el usuario como verificado
    User2.findOneAndUpdate({ Username: username }, { verified: true }, { new: true }, (err, user) => {
      if (err) {
        return res.status(500).send(err.message);
      } else {
        return res.status(200).json(user);
      }
    });
  } else {
    console.log('code:', code, 'sentCode:', sentCode);

    // Incrementa el contador de intentos fallidos
    userVerificationCodes[username].failedAttempts = (userVerificationCodes[username].failedAttempts || 0) + 1;

    // Si el número de intentos fallidos es mayor  3, eliminar usuario
    if (userVerificationCodes[username].failedAttempts > 3) {
      // Eliminar al usuario de la base de datos
      User2.deleteOne({ Username: username }, (err) => {
        if (err) {
          return res.status(500).send(err.message);
        } else {
          // Eliminar los intentos fallidos del objeto en memoria
          delete userVerificationCodes[username];
          return res.status(200).json({ message: 'Usuario eliminado correctamente debido a intentos fallidos de verificación.' });
        }
      });
    } else {
      // Notificar al usuario que el código es incorrecto
      res.status(401).json({ message: 'Código de verificación inválido. Intentos fallidos: ' + userVerificationCodes[username].failedAttempts });
    }
  }
};
// Función para autenticar usuario y crear token
const autUser2 = (req, res) => {
  console.log(req.body)
  User2.findOne({Username: req.body.Username})
    .then((user => {
      if (!user || !user.comparePassword(req.body.password)) {
        return res.status(401).json({ message: 'Usuario o contraseña erróneos' });
      }

      if (!user.verified) {
        return res.status(401).json({ message: 'Usuario no verificado' });
      }

      const token = jwt.sign({
        Username: user.Username, user_id: user._id, role: user.role,
      }, 'secret',process.env.JWT_KEY, { expiresIn: "7d"}) // Expira en 7 días
      user.token = token;
      // Envía correo electrónico al usuario autenticado
      sendEmail(user.correo, 'Iniciaste sesión en nuestra aplicación', '¡Hola! Has iniciado sesión en nuestra aplicación. ¡Disfrútala!');
      return res.status(200).json({
        Username: user.Username, user_id: user._id, role: user.role,
        token: token,
        message:"ok"
      })
    }))
    .catch ((error) => {
      console.log(error) 
    });
};


const RecuperarCuenta = (req, res) => {
  const code = Math.floor(Math.random() * 90000) + 10000; // Genera un código de 5 dígitos
  console.log(req.body);
  const Username = req.body.Username;
 

  User2.findOne({Username: Username})
  .then((user) => {
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Envía correo electrónico al usuario con el código de verificación
    
    sendEmail(user.correo, 'Código de verificación para recuperar', `Tu código de verificación es ${code}. Úsalo para recuperar tu cuenta en nuestra aplicación.`);
    userVerificationCodes[req.body.Username] = { code: code };
    res.status(200).json(user);
  })
  .catch((error) => {
    console.log(error);
    return res.status(500).json({ message: 'Error al buscar usuario' });
  });
};

const RecuperarCuentaCodigo = (req, res) => {
  const code = req.body.code;
  const Username = req.body.Username;

  if (!userVerificationCodes[Username] || toString(userVerificationCodes[Username].code) !== toString(code)) {
    return res.status(401).json({ message: 'Código de verificación inválido' });
  }

  User2.findOneAndUpdate({Username: Username}, {password: req.body.password}, {new: true})
  .then((user) => {
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Elimina el código de verificación del usuario
    delete userVerificationCodes[Username];

    return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  })
  .catch((error) => {
    console.log(error);
    return res.status(500).json({ message: 'Error al actualizar la contraseña' });
  });
};

/* GET users listing. */
const verUser2 = (req, res, next) => {
  res.send('respond with a resource');
};

module.exports = {
  addUser2,
  autUser2,
  verUser2,
  verifyUser2,
  RecuperarCuenta,
  RecuperarCuentaCodigo
};