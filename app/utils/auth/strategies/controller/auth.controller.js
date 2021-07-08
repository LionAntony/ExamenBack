const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
//basic strategy
require('../basic.js');
const {config} = require('../../../../config/index.js');

async function AuthController(req,res,next){
    passport.authenticate('basic',function(error,user){
        try{
            if(error || !user || user === undefined){
                 next(boom.unauthorized());
            }else{
                req.login(user,{session:false},async function(error){
                    if(error)  next(error);
                    const {idcat_usuario,nombre,apellidoP,apellidoM,correo,changePassword} = user;
                    const payload = {
                        id:idcat_usuario,
                        nombre,
                        apellidoP,
                        apellidoM,
                        correo
                    }
                    const token = jwt.sign(payload,config.authJwtSecret,{
                        expiresIn: '24h'
                    });
                    return res.status(200).json({token,user:{id:idcat_usuario,
                        fullName:`${nombre} ${apellidoP} ${apellidoM}`,
                        nombre,
                        apellidoP,
                        apellidoM,
                        correo,
                        changePassword
                    }})
                })
                
            }
        }catch(err){
             next(err);
        }
    })(req,res,next);
}

module.exports = AuthController;