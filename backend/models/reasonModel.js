const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../config/db')

class Reason extends Model {}

Reason.init({
    reasonType: {
        type: DataTypes.STRING, 
        allowNull: false
    }
}, {sequelize, modelName: 'reason'})

module.exports = Reason 