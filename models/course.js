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
            allowNull: true,
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.DATE,
            allowNull: false
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
        tableName: 'Courses',
        underscored: true,
        timestamps: true
    })

    return Course
}