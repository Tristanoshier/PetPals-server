module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        adoptionRecruiter: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ""
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ""
        },
        userType: {
            type: DataTypes.ENUM("Manager", "User"),
            defaultValue: "User"
        },
        ProfileImg: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "../assets/profiledefault.jpg"
        }
    })
    return User;
}