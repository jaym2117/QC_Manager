const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config(); // Chain the config call directly

// Destructure environment variables directly
const { SQL_DB: database, SQL_USER: username, SQL_PWD: password, SQL_HOST: host } = process.env;


const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: 'mssql',
});

const syncDB = async () => {
    try {
        await sequelize.sync();
    } catch (error) {
        throw new Error('Unable to sync database');
    }
};

module.exports = { sequelize, syncDB };
