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
            allowNull: true,
            defaultValue: ""
        },
        adoption: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        petPicUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "https://www.amigonaosecompra.com.br/assets/fallback/thumb_default_pet-675f19f8212c0176eb193a2110351fdf91eb20408d9d6e5ecd796310c49c11ba.png"
        }
    })
    return Pet;
}