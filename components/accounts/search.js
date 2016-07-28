var Account = require(global.__accounts_base + '/models/account');

/**
 * Search accounts
 */
var search = function onSearch(req, res, next) {
	var opts = {
		req: req,
		model: Account,
		sort: req.query.sort || 'storename',
		validation: undefined,
		extend: [{
			name: 'users',
			model: require(global.__base + '/manager').UserModel
		}]
	};

	opts.query = (req.query.lat && req.query.lng && req.query.distance) ? {
		'address.location': {
			$near: {
				$geometry: {
					type: 'Point',
					coordinates: [req.query.lat, req.query.lng]
				},
				$maxDistance: req.query.distance || parseInt(process.env.APPLICATION_SEARCH_LOCATION_DISTANCE, 10)
			}
		}
	} : {};

	require('app-search')(opts).runSearch(function onSearch(err, result) {
		return res.status(200).json(result);
	});
};

module.exports = search;
