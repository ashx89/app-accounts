var geocoder = require('node-geocoder')('google', 'https');
var mongoose = require('mongoose');
var validator = require('mongoose-validators');

var METERS_IN_MILES = 1609.34;

/**
 * Postcode max length 9. e.g. AB12 34CD
 */
function validZipcodeLength(value) {
	return value && value.length <= 9;
}

/**
 * Check description character length
 */
function validTextLength(value) {
	return value.length < 300;
}

var accountSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	customer: String,

	storename: {
		type: String,
		validate: [validator.isAlpha, 'Invalid Storename']
	},
	description: {
		type: String,
		validate: [validTextLength, 'Description is too long']
	},
	image: {
		type: String
	},

	phonenumber: {
		type: String,
		validate: [validator.isNumeric, 'Invalid Phone Number']
	},

	address: {
		line1: {
			type: String,
			validate: [validator.isAlphanumeric, 'Invalid Address Line 1']
		},
		line2: {
			type: String,
			validate: [validator.isAlphanumeric, 'Invalid Address Line 2']
		},
		city: {
			type: String,
			validate: [validator.isAlpha, 'Invalid City']
		},
		zipcode: {
			type: String,
			validate: [
				{ validator: validator.isAlphanumeric, message: 'Invalid Zipcode' },
				{ validator: validZipcodeLength, message: 'Invalid Zipcode' }
			]
		},
		location: {
			type: [Number],
			index: '2d'
		},
		country: {
			type: String
		},
		country_code: {
			type: String
		}
	},
	currency: String
}, {
	minimize: true,
	timestamps: true
});

/**
 * Get the full address
 */
accountSchema.virtual('fulladdress').get(function onGetFullAddress() {
	return this.address.line1 + ', ' +
			this.address.line2 + ', ' +
			this.address.city + ', ' +
			this.address.zipcode;
});

accountSchema.pre('save', function onModelSave(next) {
	var account = this;
	// Set delivery radius. (miles * meteres in miles). Geocoder uses meteres
	// account.delivery.radius = parseInt(account.delivery.radius, 10) * METERS_IN_MILES;

	// if (account.delivery.is_free === true) account.delivery.free_over = undefined;
	// if (account.delivery.cost === 0) account.delivery.free_over = undefined;

	geocoder.geocode(account.fulladdress, function onGeocode(err, res) {
		if (err) return next(err);
		if (!res.length) return next(new Error('Could not find the address entered'));

		account.address.location = [res[0].latitude, res[0].longitude];
		account.address.country = res[0].country;
		account.address.country_code = res[0].countryCode;
		return next();
	});
});

accountSchema.set('toJSON', {
	virtuals: true,
	transform: function onTransform(doc, ret) {
		delete ret.id;
		delete ret.__v;
		return ret;
	}
});

module.exports = mongoose.model('Account', accountSchema);
