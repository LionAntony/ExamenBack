const express=require('express');
const userController=require('../controllers/controller.users.js');
const validationHandler=require('../../utils/middleware/validationHandler.js');
const createUserSchema=require('../schemas/createUser.js');
const updateUserSchema=require('../schemas/updateUser.js');
const deleteAndGetUserSchema=require('../schemas/deleteAndGetUser.js');
function UserRoutes(app) {
    const router=express.Router();
    const user=new userController();
    app.use('/api/users',router);
    // Ruta para la creación de usuarios
    router.get('/podologos',user.getPodologos);
    router.post('/',validationHandler(createUserSchema),user.create);
    // Ruta para la actualización de datos del usuario.
    router.put('/',validationHandler(updateUserSchema),user.update);
    // Ruta para eliminar a un usuario
    router.delete('/:idUser',validationHandler(deleteAndGetUserSchema,'params'),user.delete);
    // Ruta para traer a todos los usuarios de la base de datos.
    router.get('/',user.getAll);
    // Ruta para traer a un usuario de la base de datos
    router.get('/:idUser',validationHandler(deleteAndGetUserSchema,'params'),user.get);
}
module.exports=UserRoutes;