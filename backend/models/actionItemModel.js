const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../config/db')

class ActionItem extends Model {}

ActionItem.init({
    sortIdx: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
    },
    section: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    description: {
        type: DataTypes.STRING
    }, 
    completed: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false
    }, 
    completedBy: {
        type: DataTypes.STRING
    }, 
    completedOn: {
        type: DataTypes.DATE
    }
}, {sequelize, modelName: 'actionItem'})


module.exports = ActionItem