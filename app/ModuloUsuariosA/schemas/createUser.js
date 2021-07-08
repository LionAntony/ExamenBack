const joi=require('@hapi/joi');

const createUserSchema={
    fk_tipo_nomina: joi.number().required(),
    nombre: joi.string().regex(/^[A-Za-z]/).min(3).max(100).required(),
    apellidoP: joi.string().regex(/^[A-Za-z]/).min(3).max(100).required(),
    apellidoM: joi.string().regex(/^[A-Za-z]/).min(3).max(100).required(),
    correo: joi.string().email().required(),
    password: joi.string().max(20).required(),
    color: joi.string().required(),
    status: joi.number().min(0).max(1)
};

module.exports=createUserSchema;