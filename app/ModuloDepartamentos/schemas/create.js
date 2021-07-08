const joi=require('@hapi/joi');

const createSchema={
    nombre: joi.string().regex(/^[A-Za-z]/).max(100).required(),
    empresa: joi.number().required()
}
module.exports=createSchema;