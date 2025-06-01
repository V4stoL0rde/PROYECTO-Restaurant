const mongoose = require('mongoose');

const PagoSchema = new mongoose.Schema({
    pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PedidoGrupo' }], // plural
  metodo: { type: String, enum: ['efectivo', 'transbank', 'tarjeta'], required: true },
  propina: { type: Number, default: 0 },
  total: { type: Number, required: true }, // total base
  totalConPropina: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'completado', 'fallido'], default: 'pendiente' },
  transaccionId: String, // útil para Transbank
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pago', PagoSchema);