const Pago = require('../models/pago');


// Crear un nuevo pago
exports.crearPago = async (req, res) => {
  try {
    const { pedidos, metodo, propina, total, totalConPropina, transaccionId } = req.body;

      if (!pedidos || !Array.isArray(pedidos) || pedidos.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un ID de pedido' });
    }

    const nuevoPago = new Pago({
      pedidos,
      metodo,
      propina,
      total,
      totalConPropina,
      transaccionId,
      estado:'completado' 
    });

    const pagoGuardado = await nuevoPago.save();
    res.status(201).json(pagoGuardado);
  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({ error: 'Error al crear el pago' });
  }
};

// Obtener un pago por ID de pedido
exports.obtenerPagoPorPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const pago = await Pago.findOne({ pedido: pedidoId });

    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    res.json(pago);
  } catch (error) {
    console.error('Error al buscar el pago:', error);
    res.status(500).json({ error: 'Error al obtener el pago' });
  }
};

// Actualizar estado del pago (por ejemplo, si Transbank confirma)
exports.actualizarEstadoPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, transaccionId } = req.body;

    const pagoActualizado = await Pago.findByIdAndUpdate(
      id,
      { estado, ...(transaccionId && { transaccionId }) },
      { new: true }
    );

    if (!pagoActualizado) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    res.json(pagoActualizado);
  } catch (error) {
    console.error('Error al actualizar el estado del pago:', error);
    res.status(500).json({ error: 'Error al actualizar el pago' });
  }
};


exports.obtenerEstadisticasGanancias = async (req, res) => {
  try {


    const pagos = await Pago.aggregate([
  { $match: { estado: 'completado' } },
  {
    $project: {
      total: 1,
      propina: 1,
      año: { $year: "$fecha" },
      mes: { $month: "$fecha" },
      dia: { $dayOfMonth: "$fecha" }
    }
  },
  {
    $group: {
      _id: {
        año: "$año",
        mes: "$mes",
        dia: "$dia"
      },
      totalGanado: { $sum: "$total" },
      totalPropinas: { $sum: "$propina" },
      cantidadPagos: { $sum: 1 }
    }
  },
  { $sort: { "_id.año": 1, "_id.mes": 1, "_id.dia": 1 } }
]);


    res.json(pagos); // ya es un array, usable directamente por el frontend
  } catch (error) {
    console.error('Error al calcular estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
