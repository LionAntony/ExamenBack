const express = require('express');
const AuthController = require('../controller/auth.controller.js')


function AuthApi(app) {
    const router = express.Router();
    app.use('/api/auth', router);

    router.options('/sign-in', AuthController);
}

module.exports = AuthApi;