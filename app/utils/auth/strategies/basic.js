const passport=require('passport');
const {BasicStrategy}=require('passport-http');
const boom=require('@hapi/boom');
const bcrypt=require('bcrypt');
const UserServices=require('../../../ModuloUsuariosA/services/service.users.js');

passport.use(new BasicStrategy(async function(correo,password,cb) {
    const userService=new UserServices();
    try {
        // const getDataService=await userService.getFullDataUser(correo)
        const getDataService=await userService.getFullDataUserForLogin(correo)
        if(getDataService.err) {
            return cb(boom.unauthorized(),false);
        }
        const user=getDataService.data;
        const passDecrypt=await bcrypt.compare(password,user.password)
        if(passDecrypt) {
            delete user.password;
            return cb(null,user);
        }
        cb(boom.unauthorized(),false)
    } catch(err) {
        cb(err);
    }
}))