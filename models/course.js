'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        static associate(model) {

        }
    }

    Course.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true 
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, 
    {
        sequelize,
        modelName: 'Course',
        tableName: 'courses',
        underscored: true,
        timestamps: true
    })

    return Course
}