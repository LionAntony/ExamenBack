const UserRoutes = require('./routes.users.js');
function indexUserRoutes(app){
    UserRoutes(app);
}
module.exports = indexUserRoutes