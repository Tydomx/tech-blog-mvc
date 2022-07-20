// collecting endpoints and prefixing them with api
const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
// just in case there's an endpoint that doesn't exist
router.use((req, res) => {
	res.status(404).end();
});

module.exports = router;