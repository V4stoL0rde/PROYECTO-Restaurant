const mongoose = require("mongoose");

const bcrypt = require('bcrypt');

const roles = {
    values: ['ADMIN', 'TRABAJADOR',"CLIENTE"],
    message: '{VALUE} no es un rol v�lido'
  }

const userSchema = new mongoose.Schema({
  Username:   { type: String,unique: true, required : [true, 'El nombre es necesario'] },
  password: { type: String, required: [true, 'Pass es necesario'] },
  role: { type: [String], default: 'CLIENTE', enum: roles ,required: [true, 'Roles are mandatory']},
  token: {type: String,required: [false, 'Session token is not mandatory'],default: '' },
  code: { type: String },
  correo: {type: String},
  verified: { type: Boolean, default: false } 
  
});
//

userSchema.pre('save', function(next) {
    var user = this;

      // Solo hashear la contraseña si ha sido modificada (o si es nueva)
    if (!user.isModified('password')) return next();

      // Generar una "sal" (salt)
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // Hashear la contraseña usando la nueva sal
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // Reemplazar la contraseña en texto plano con la versión hasheada
            user.password = hash;
            next();
        });
    });
});

//coparar contrase�a encyptada

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = User2 = mongoose.model('Usuarios', userSchema);