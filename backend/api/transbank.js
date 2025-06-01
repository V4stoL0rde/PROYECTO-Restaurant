const express = require("express");
const { WebpayPlus } = require("transbank-sdk");

const router = express.Router();
WebpayPlus.configureForTesting(); // Modo simulación

// Endpoint para iniciar una transacción
router.post("/crear-transaccion", async (req, res) => {
    const { monto, ordenCompra, sesionId, returnUrl } = req.body;

    try {
        const response = await new WebpayPlus.Transaction().create(
            ordenCompra, 
            sesionId, 
            monto, 
            returnUrl
        );
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para confirmar la transacción
router.post("/confirmar-transaccion", async (req, res) => {
    const { token_ws } = req.body;

    try {
        const response = await new WebpayPlus.Transaction().commit(token_ws);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;