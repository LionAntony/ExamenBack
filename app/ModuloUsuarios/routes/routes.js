const express=require('express');
const Controller=require('../controllers/controller')
const validationHandler=require('../../utils/middleware/validationHandler.js');
const createSchema=require('../schemas/create.js');
const updateSchema=require('../schemas/update.js');
const deleteAndGetSchema=require('../schemas/deleteAndGet.js');



module.exports=(app) => {
    let router=express.Router();
    const controller=new Controller();
    app.use('/usuarios',router)

    // Ruta para traer a todo
    router.get('/',controller.getAlls);

    // Ruta para la creación 
    router.post('/',validationHandler(createSchema),controller.create);

    // Ruta para Actualizar datos 
    router.patch('/',validationHandler(updateSchema),controller.update);

    //Ruta para eliminar 
    router.delete('/:id',validationHandler(deleteAndGetSchema,'params'),controller.delete);

    // Ruta para traer a un solo registro
    router.get('/:id',validationHandler(deleteAndGetSchema,'params'),controller.get);


}