const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
	// access User model and run .findAll() method
	User.findAll({
		attributes: { exclude: ['password'] }
	})
		.then(dbUserData => res.json(dbUserData))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// GET api/users/1
router.get('/:id', (req, res) => {
	User.findOne({
		attributes: { exclude: ['password'] },
		where: {
			id: req.params.id
		}
	})
		.then(dbUserData => {
			if (!dbUserData) {
				res.status(404).json({ message: 'User not found with this id' });
				return;
			}
			res.json(dbUserData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// POST api/users
router.post('/', (req, res) => {
	// expect {username: tydomx, password: password123}
	User.create({
		username: req.body.username,
		password: req.body.password
	})
		.then(dbUserData => {
			req.session.save(() => {
				req.session.user_id = dbUserData.id;
				req.session.username = dbUserData.username;
				req.session.loggedIn = true;

				res.json(dbUserData);
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// POST /api/users/login
router.post('/login', (req, res) => {
	// {expects username: tydomx, password: password123}
	User.findOne({
		where: {
			email: req.body.email
		}
	})
		.then(dbUserData => {
			if (!dbUserData) {
				res.status(400).json({ message: 'No user with that username!' });
				return;
			}
			const validPassword = dbUserData.checkPassword(req.body.password);

			if (!validPassword) {
				res.status(400).json({ message: 'Incorrect password!' });
				return;
			}
			req.session.save(() => {
				req.session.user_id = dbUserData.id;
				req.session.username = dbUserData.username;
				req.session.loggedIn = true;

				res.json({ user: dbUserData, message: 'You are now logged in!' });
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// POST logout
router.post('/logout', (req, res) => {
	if (req.session.loggedIn) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	}
	else {
		res.status(404).end();
	}
});

// PUT api/users/1
router.put('/:id', (req, res) => {
	// expect {username: tydomx, password: password1234}
	User.update(req.body, {
		individualHooks: true,
		where: {
			id: req.params.id
		}
	})
		.then(dbUserData => {
			if (!dbUserData) {
				res.status(404).json({ message: 'No user found with this id' });
				return;
			}
			res.json(dbUserData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// DELETE api/users/1
router.delete('/:id', (req, res) => {
	User.destroy({
		where: {
			id: req.params.id
		}
	})
		.then(dbUserData => {
			if (!dbUserData) {
				res.status(404).json({ message: 'No user found with this id to remove!' });
				return;
			}
			res.json(dbUserData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;