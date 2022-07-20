const router = require('express').Router();
const { Post, User } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
	console.log('=====================');
	Post.findAll({
		attributes: [
			'id',
			'title',
			'content',
			'created_At'
		],
		order: [
			['created_At', 'DESC']
		],
		include: [{
			model: User,
			attributes: ['username']
		}]
	})
		.then(dbPostData => res.json(dbPostData.reverse()))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.get('/:id', (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id
		},
		attributes: [
			'id',
			'content',
			'title',
			'created_At'
		],
		include: [{
			model: User,
			attributes: ['username']
		}]
	})
		.then(dbPostData => {
			if (!dbPostData) {
				res.status(404).json({ message: 'No post found with this id' });
				return;
			}
			res.json(dbPostData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.put('/:id', (req, res) => {
	Post.update({
		title: req.body.title,
		content: req.body.content
	},
		{
			where: {
				id: req.params.id
			}
		})
		.then(dbPostData => {
			if (!dbPostData) {
				res.status(404).json({ message: 'No post found with this id' });
				return;
			}
			res.json(dbPostData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});


router.delete('/:id', (req, res) => {
	Post.destroy({
		where: {
			id: req.params.id
		}
	})
		.then(dbPostData => {
			if (!dbPostData) {
				res.status(404).json({ message: 'No post found with this id to remove!' });
				return;
			}
			res.json(dbPostData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;