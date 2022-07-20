// importing User model and exporting object w/ it as property
const User = require('./User');
const Post = require('./Post');

// create associations
User.hasMany(Post, {
	foreignKey: 'user_id'
});

Post.belongsTo(User, {
	foreignKey: 'user_id',
	onDelete: 'CASACADE'
});

module.exports = { User, Post };