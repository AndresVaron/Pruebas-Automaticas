const MongoClient = require('mongodb').MongoClient;
const MongoConnection = require('./utils/MongoConnection');
const app = require('./app');
const debug = require('debug')('pruebas-automaticas:server');
const http = require('http');
const mongoUrl = process.env.MONGO_URL;
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

MongoClient.connect(
    mongoUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        promiseLibrary: Promise,
    },
    (err, db) => {
        if (err) {
            console.log(`Error conectándose a la base de datos. ${err.stack}`);
        } else {
            console.log(`Se ha conectado a la base de datos "${mongoUrl}" exitosamente`);
            MongoConnection.setInstance(db);
            server.listen(port);
            server.on('error', onError);
            server.on('listening', onListening);
        }
    }
);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
