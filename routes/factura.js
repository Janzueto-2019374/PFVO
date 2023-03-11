const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerFactura, obtenerFacturaPorId, crearFactura, actualizarFactura, eliminarFactura } = require('../controllers/factura');


const {  existeProductoPorId, existeFacturaPorId, validarStock } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarProducto, validarUsuarioProducto } = require('../middlewares/validar-productos');

//Controllers
const router = Router();

// Obtener todas las facturas - publico
router.get('/', obtenerFactura);

// Obtener una factura por el id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],obtenerFacturaPorId);

// Crear factura - privado - cualquier persona con un token valido
router.post('/agregar', [
    validarJWT,
    //validarStock,
    //validarCampos
], crearFactura);

// Actualizar factura - privado - se requiere id y un token valido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeFacturaPorId ),
    validarCampos
], actualizarFactura);

// Borrar una factura - privado - se requiere id y un token valido - solo el admin puede borrar
router.delete('/eliminar/:id', eliminarFactura);

module.exports = router;