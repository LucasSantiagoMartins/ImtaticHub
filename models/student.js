'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {
    class Student extends Model{
        static associate(models){

        }
    }
    Student.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        full_name: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        course: {
            allowNull: false,
            type: DataTypes.STRING
        },
        class: {
            allowNull: true,
            type: DataTypes.STRING
        },
        grade: {
            allowNull: false,
            type: DataTypes.STRING
        },
        registration_number: {
            allowNull: false,
            type: DataTypes.STRING
        },
        academic_year: {
            allowNull: false,
            type: DataTypes.STRING
        },
    },
    {
        sequelize, 
        modelName: 'Students'
    })

    return Student
}