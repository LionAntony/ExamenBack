const passport=require('passport');
const {Strategy,ExtractJwt}=require('passport-jwt');
const boom=require('@hapi/boom');

const UserServices=require('../../../ModuloUsuariosA/services/service.users.js');
const {config}=require('../../../config/index.js');

passport.use(
    new Strategy({
        secretOrKey: config.authJwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
        async function(tokenPayload,cb) {
            const userService=new UserServices();
            try {
                const dataService=await userService.getFullDataUser(tokenPayload.correo);
                if(dataService.err) {
                    cb(boom.unauthorized(),false)
                }
                const user=dataService.data;
                delete user.password;
                cb(null,{...user})

            } catch(error) {
                return cb(error);
            }
        })
)