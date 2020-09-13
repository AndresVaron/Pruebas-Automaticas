class MongoConnection {
    static setInstance(db) {
        if (MongoConnection.instance !== null) {
            throw 'Already instantiated';
        } else {
            MongoConnection.instance = db;
        }
    }

    static getInstance() {
        if (MongoConnection.instance === null) {
            throw 'Not instantiated';
        } else {
            return MongoConnection.instance.db('pruebas_automaticas');
        }
    }
}

MongoConnection.instance = null;

module.exports = MongoConnection;
