'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {
    class User extends Model{
        static associate(models){

        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            allowNull: true,
            type: DataTypes.STRING
        },
        phone_number: {
            allowNull: false,
            type: DataTypes.STRING
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
        createdAt: {
           type: Sequelize.DATE,
           allowNull: false,
        },
        updatedAt: {
           type: Sequelize.DATE,
           allowNull: false,
        },
    
    },
    {
        sequelize, 
        modelName: 'Users'
    })
    
    return User

}