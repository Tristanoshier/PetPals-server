const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => console.log('database is connected'))
    .catch((err => console.log(err)))

User = sequelize.import('./models/user');
Pets = sequelize.import('./models/pet');
Posts = sequelize.import('./models/post');

Pets.belongsTo(User);
Posts.belongsTo(User);
User.hasMany(Pets);
User.hasMany(Posts);

module.exports = sequelize;



