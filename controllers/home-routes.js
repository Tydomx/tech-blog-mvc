// file for all user-facing routes, homepage and login page
const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
	res.render('homepage', {

	})
});

module.exports = router;