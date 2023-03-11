const { Router } = require('express');
const { check } = require('express-validator');


const {  existeProductoPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

//Controllers
const { obtenerProductoPorId, obtenerProductos, crearProducto, actualizarProducto, eliminarProducto, obtenerProductosMasVendidos, obtenerProductosAgotados } = require('../controllers/producto');
const router = Router();

// Obtener todas los productos - publico
router.get('/', obtenerProductos);

router.get('/popular', obtenerProductosMasVendidos);

router.get('/agotados', obtenerProductosAgotados);

// Obtener un producto por el id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],obtenerProductoPorId);

// Crear Producto - privado - cualquier persona con un token valido
router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre del Producto es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto);

// Actualizar Producto - privado - se requiere id y un token valido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre', 'El nombre del Producto es obligatorio').not().isEmpty(),
    validarCampos
], actualizarProducto);

// Borrar un producto - privado - se requiere id y un token valido - solo el admin puede borrar
router.delete('/eliminar/:id', eliminarProducto);

module.exports = router;