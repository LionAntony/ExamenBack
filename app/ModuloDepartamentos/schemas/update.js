const joi=require('@hapi/joi');

const updateSchema={
    id: joi.number().required(),
    empresa: joi.number().required(),
    nombre: joi.string().regex(/^[A-Za-z]/).max(100).required(),
}
module.exports=updateSchema;