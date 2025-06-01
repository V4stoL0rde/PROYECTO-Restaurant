const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');


router.get('/ganancias', pagoController.obtenerEstadisticasGanancias);

router.post('/', pagoController.crearPago);
router.get('/:pedidoId', pagoController.obtenerPagoPorPedido);
router.put('/estado/:id', pagoController.actualizarEstadoPago);



module.exports = router;