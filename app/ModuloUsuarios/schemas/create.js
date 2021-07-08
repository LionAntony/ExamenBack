const joi=require('@hapi/joi');

const createSchema={
    nombre: joi.string().regex(/^[A-Za-z]/).max(100).required(),
    apellidoP: joi.string().regex(/^[A-Za-z]/).max(100).required(),
    apellidoM: joi.string().regex(/^[A-Za-z]/).max(100).required(),
    correo: joi.string().regex(/^[A-Za-z]/).max(100).required(),
    password: joi.string().required(),
    status: joi.number().min(0).max(1)
}
module.exports=createSchema;