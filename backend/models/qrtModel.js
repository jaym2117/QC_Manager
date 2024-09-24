const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../config/db')
const ActionItem = require('./actionItemModel')
const Reason = require('./reasonModel')

class QRT extends Model {}

QRT.init({
    qrtID: {
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true
    }, 
    qrtStatus: {
        type: DataTypes.STRING, 
        allowNull: false, 
        defaultValue: 'In Progress'
    }, 
    qrtType: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    jobNumber: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    generatedBy: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    assignedTo: {
        type: DataTypes.STRING
    }, 
    requiredDate:{
        type: DataTypes.DATE, 
        allowNull: false
    }, 
    reasonDesc: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
}, {
    sequelize, 
    modelName: 'qrt', 
})

QRT.hasMany(ActionItem); 
ActionItem.belongsTo(QRT);
QRT.belongsTo(Reason); 

module.exports = QRT