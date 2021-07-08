var express = require('express');
var app = express();
var bodyParser = require('body-parser');
let fileUpload = require('express-fileupload');
const cors = require('cors');
const notFoundHandler = require('./app/utils/middleware/notFoundHandler');
const {
    logErrors,
    wrapErrors,
    errorHandler
} = require('./app/utils/middleware/errorHandlers.js');
const { autoCommit } = require('oracledb');
const { now } = require('moment');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(fileUpload());
app.use(cors({ origin: '*' }));
app.get('/', (req, res) => {
        res.json({ message: 'Hello Podologos,' + new Date(now()) });
    })
    // app.options('*', cors());

app.use('/public', express.static('./public'));

// Routs
require('./app/indexRouts.js')(app);
// Catch 404
app.use(notFoundHandler);
// Errors
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);
var port = process.env.PORT || 1338;
var host = '0.0.0.0';
const server = app.listen(port, host, function(err) {
    if (!err) console.log(`Server On  Port: ${port}`);
    else console.log(err);
});
server.timeout = 0;