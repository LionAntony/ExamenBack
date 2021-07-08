/**Se llaman las rutas de cada modulo */
const Modulo=require('./routes/routes.js');

module.exports=(app) => {
  /**Se inicializa el modulo */
  Modulo(app);

}