const express=require('express');
const AuthController=require('../controller/auth.controller.js')
const userServicios=require('../../../../ModuloUsuariosA/services/service.users');
const passport=require('passport');
require('../jwt');
function AuthApi(app) {
    const router=express.Router();
    app.use('/api/auth',router);
    const user=new userServicios();
    router.post('/sign-in',AuthController);
    router.get('/sign-in/token',
        passport.authenticate('jwt',{session: false}),
        async function(req,res) {
            const {correo}=req.user;
            try {
                const dataUser=await user.getFullDataUser(correo);
                delete dataUser.data.password
                delete dataUser.data.changePassword
                res.json(dataUser);
            } catch(err) {
                console.log(err);
                next(err);
            }
        })
}

module.exports=AuthApi;