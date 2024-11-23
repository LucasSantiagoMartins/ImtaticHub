'use strict'
const { Model } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {

        }

        isValidPassword(password) {
            return bcrypt.compare(password, this.password)
        }
    }

    User.init(
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: DataTypes.STRING,
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
        
    },
    {
      sequelize,
      modelName: 'User'  
    });

    return User;
}