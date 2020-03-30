module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ""
        }
    })
    return post;
}