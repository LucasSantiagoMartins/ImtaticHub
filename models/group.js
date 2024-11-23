const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Group extends Model {
        static associate(models) {

        }
    }
    Group.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNUll: false
        }

    },
    {
        sequelize,
        modelName: 'Group'
    })

    return Group;
}