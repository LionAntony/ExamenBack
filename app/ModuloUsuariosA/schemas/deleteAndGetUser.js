const joi = require('@hapi/joi');

const deleteUserSchema = {
    idUser: joi.number().min(1).required()
};

module.exports = deleteUserSchema;