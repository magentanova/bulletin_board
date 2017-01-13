let Router = require('express').Router;
const bulletinRouter = Router()

let Bulletin = require('../../db/schemas/bulletinSchema.js').Bulletin

bulletinRouter
	.get(`/bulletin`, function(req, res){
		Bulletin.find(req.query , "-password", function(err, results){
			if(err) return res.json(err) 
		res.json(results)
		})
	})

	.get(`/bulletin/:_id`, function(req, res){
		Bulletin.findById(req.params._id, "-password", function(err, record){
			if(err || !record ) return res.json(err) 
			res.json(record)
		})
	})

	.post(`/bulletin`, function(req,res) {
		let newRecord = new Bulletin(req.body)
		newRecord.save(function(err) {
			if (err) {
				console.log(err)
				res.status(500).send(err)
			}
			else {  
				res.json(newRecord)
			}
		})
	})

	.put(`/bulletin/:_id`, function(req, res){
		Bulletin.findByIdAndUpdate(req.params._id, req.body, function(err, record){
			if (err) {
				res.status(500).send(err)
			}
			else if (!record) {
				res.status(400).send(`no record found with that id`)
			}
			else {
				res.json(req.body)
			}
		})
	})

	.delete(`/bulletin/:_id`, function(req, res){
		Bulletin.remove({ _id: req.params._id}, (err) => {
			if(err) return res.json(err)
			res.json({
				msg: `record ${req.params._id} successfully deleted`,
				_id: req.params._id
			})
		})
	})

module.exports = bulletinRouter
