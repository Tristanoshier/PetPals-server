module.exports = (sequelize, DataTypes) => {
    const Pet = sequelize.define('pet', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        animal: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: false
        },
        adoption: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        petPicUrl: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return Pet;
}