'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {
    class Student extends Model{
        static associate(models){
            Student.belongsTo(models.User, { foreignKey: 'userId', as: 'user'})
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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize, 
        modelName: 'Student',
        tableName: 'students',
        underscored: true
    })

    return Student
}