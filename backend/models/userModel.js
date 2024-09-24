const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../config/db')
const bcrypt = require('bcryptjs')

class User extends Model {
    async matchPassword (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    }
    async saltPassword() {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
}

User.init({
    employeeID: {
        type: DataTypes.INTEGER, 
        primaryKey: true
    }, 
    firstName: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    lastName: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    emailAddress: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    department: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    password: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    isAdmin: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false
    }
}, {
    sequelize, 
    modelName: 'users', 
    freezeTableName: true 
})


module.exports = User