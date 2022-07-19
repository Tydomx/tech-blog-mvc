const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create the User model
class User extends Model {
	// set up method to run on instance data (per user) to check password
	checkPassword(loginPW) {
		return bcrypt.compareSync(loginPW, this.password);
	}
}

// define tables columns and configuration
User.init(
	{
		// define id column
		id: {
			// use special Sequelize DataTypes object to provide what type of data it is
			type: DataTypes.INTEGER,
			// SQL of 'NOT NULL'
			allowNull: false,
			// primary key
			primaryKey: true,
			// auto increment
			autoIncrement: true
		},
		// username column
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// password column
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				// password must be at least 4 characters long
				len: [4]
			}
		}
	},
	{
		hooks: {
			// set up beforeCreate lifecycle 'hook' functionality
			async beforeCreate(newUserData) {
				newUserData.password = await bcrypt.hash(newUserData.password, 10);
				return newUserData;
			},
			// set up beforeUpdate lifecycle 'hook' functionality
			async beforeUpdate(updatedUserData) {
				updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
				return updatedUserData;
			}
		},
		// pass in imported sequelize connection (direct connection to DB)
		sequelize,
		// don't automatically create createdAt/updatedAt timestamp Fields
		timestamps: false,
		// don't pluralize name of DB table
		freezeTableName: true,
		// use underscores instead of camel-casing
		underscored: true,
		// make so model name stays lowercase in DB
		modelName: 'user'
	}
);

module.exports = User;