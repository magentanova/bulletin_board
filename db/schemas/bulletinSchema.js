const mongoose = require('mongoose');
const createModel = mongoose.model.bind(mongoose);
const Schema = mongoose.Schema;

// ----------------------
// USERS
// ----------------------
const bulletinSchema = new Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	signed: {type: String, default: 'anonipotamus'},
	imageURL: String,
	created_at: {type:Date, default: Date.now}
})

module.exports = {
   Bulletin: createModel(' Bulletin', bulletinSchema),
}
