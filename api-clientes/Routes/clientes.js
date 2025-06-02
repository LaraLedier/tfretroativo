const express = require('express');
const router = express.Router();
const controller = require('../Controllers/ClienteController');

router.post('/clientes', controller.createCliente);
router.get('/clientes/:codigo', controller.getCliente);
router.get('/clientes', controller.listClientes);
router.put('/clientes/:codigo', controller.updateCliente);
router.delete('/clientes/:codigo', controller.deleteCliente);

module.exports = router;
