/**Se llaman las rutas de cada modulo */
const ModuloEmpresas=require('./routes/routes.js');

module.exports=(app) => {
  /**Se inicializa el modulo */
  ModuloEmpresas(app);

}