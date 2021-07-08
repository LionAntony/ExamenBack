/**Se llaman los index de cada modulo */
const passport=require('passport');
const AuthRoutes=require('./utils/auth/strategies/routes/auth.js');
const AuthRoutesOptions=require('./utils/auth/strategies/routes/authOptions.js');
const UserRoutes=require('./ModuloUsuariosA/routes/index.js');
const ModuloEmpresas=require('./ModuloEmpresas/index')
const ModuloDepartamentos=require('./ModuloDepartamentos/index')
const ModuloEmpleados=require('./ModuloEmpleados/index')
const ModuloUsuarios=require('./ModuloUsuarios/index')


require('./utils/auth/strategies/jwt.js');
module.exports=(app) => {
    /**Se inicializa el modulo */
    AuthRoutes(app);
    AuthRoutesOptions(app);
    app.use(passport.authenticate('jwt',{session: false}));
    UserRoutes(app);
    ModuloEmpresas(app);
    ModuloDepartamentos(app);
    ModuloEmpleados(app);
    ModuloUsuarios(app);


}