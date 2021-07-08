const joi=require('@hapi/joi');

const updateSchema={
    id: joi.number().required(),
    nombre: joi.string().regex(/^[A-Za-z]/).max(100).required(),
    apellidoP: joi.string().regex(/^[A-Za-z]/).max(100).required(),
    apellidoM: joi.string().regex(/^[A-Za-z]/).max(100).required(),
    fechaNacimiento: joi.string().regex(/^\d{4}[\-\/\s]?((((0[13578])|(1[02]))[\-\/\s]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[\-\/\s]?(([0-2][0-9])|(30)))|(02[\-\/\s]?[0-2][0-9]))$/).max(10).required(),
    correo: joi.string().regex(/^[A-Za-z]/).max(100).required(),
    genero: joi.string().regex(/^[A-Za-z]/).max(15),
    telefono: joi.string().regex(/^[0-9]{10}/).max(10),
    celular: joi.string().regex(/^[0-9]{10}/).max(10),
    departamento: joi.number().required()
}
module.exports=updateSchema;