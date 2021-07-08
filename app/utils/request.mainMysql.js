const connectionMysql = require('./connection.mainMysql.js');
/**
 * mainRequest is responsible of get data of the database 
 * by main connection.
 * @param {string} query is the request to main database
 */
function mainRequest(query){
    return new Promise((resolve,reject)=>{
        connectionMysql().then(connection=>{
            connection.query(query).then(([rows])=>{
                connection.end();
                resolve(rows)
            }).catch(err=>{
                connection.end();
                reject(err);
                console.log(err);
            });
        }).catch(err=>{
            reject(err);
            console.log(err);
        });
    })
}

module.exports = mainRequest;