/**
 * Search accounts
 */
var search = function onSearch(req, res, next) {
	var opts = {
		req: req,
		model: require(global.__accounts_base + '/models/account'),
		sort: req.query.sort || 'storename'
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
