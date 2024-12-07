'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {
    class Teacher extends Model {
        static associate(models) {

        }
    }

    Teacher.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birth_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
         updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Teacher',
        tableName: 'teachers',
        underscored: true,
        timestamps: true
    })

    return Teacher
}