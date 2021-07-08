const joi=require('@hapi/joi');

const deleteAndGetSchema={
    id: joi.number().required()
};

module.exports=deleteAndGetSchema;