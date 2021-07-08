const joi=require('@hapi/joi');

const updateUserSchema={
    idUser: joi.number().required(),
    fk_tipo_nomina: joi.number().min(1).required(),
    nombre: joi.string().regex(/^[A-Za-z]/).min(3).max(100).required(),
    apellidoP: joi.string().regex(/^[A-Za-z]/).min(3).max(100).required(),
    apellidoM: joi.string().regex(/^[A-Za-z]/).min(3).max(100).required(),
    correo: joi.string().email().required(),
    color: joi.string().required(),
    password: joi.string(),
    status: joi.number().min(0).max(1)
}

module.exports=updateUserSchema;