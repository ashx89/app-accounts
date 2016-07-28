/**
 * Search users
 */
var search = function onSearch(req, res, next) {
	var opts = {
		req: req,
		model: require(global.__base + '/manager').UserModel,
		sort: req.query.sort || 'lastname'
	};

	opts.query = {};

	require('app-search')(opts).runSearch(function onSearch(err, result) {
		return res.status(200).json(result);
	});
};

module.exports = search;
