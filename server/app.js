/**
 * @fileOverview The principal part of the AndreDevayAPI that executes CRUD
 * @author <a href="mailto:andretorresdg@usp.br">André Devay</a>
 * @version 1.0
 */

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const _ = require('lodash');
const Request = require('request');

var mongoose = require('mongoose');
var {mongoose} = require('./models/mongoose');
var {ObjectID} = require('mongodb');
var bodyParser = require('body-parser');
var app = express();
var {Login} = require('./models/login.js');
var Joi = require('joi')


app.use(bodyParser.json());


/** @description This command create a new user. */

app.post('/users', (req,res) => {
	var schema = Joi.object().keys({
		email: Joi.string().required(),
		first_name: Joi.string().required(),
		last_name:Joi.string().required(),
		personal_phone:Joi.string().required(),
		password:Joi.string().required()
	});
	const newUser = {
		email: req.body.email,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		personal_phone: req.body.personal_phone,
		password: req.body.password
	}
	const {error, value} = Joi.validate(newUser, schema);
	console.log(error)
	if (error === null) {
		var hash = bcrypt.hashSync(req.body.password);
		var login = new Login({
			email: req.body.email ,
			first_name: req.body.first_name ,
			last_name: req.body.last_name ,
			personal_phone: req.body.personal_phone ,
			password: hash
		})
		login.save().then((doc) => {
			res.send(doc);
		}), (e) => {
			console.log('An error ocurred');
			res.status(400).send(e);	
		}
	} else {
		res.send(e)
		console.log('ERROR! You cannot create a new user like this. Please, retry.')
	}   	 
});



/** @description This command returns an array of JSON with all the users in the database.  */

app.get('/users', (req, res) => {
	Login.find().then((login) => {
		res.send(login);
	}, (e) => {
		res.status(400).send(e);
	});
});


/** @description This command returns a specific user. */

app.get('/users/:id', (req, res) => {
	var id = req.params.id;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Login.findById(id).then((login) => {
		if(!login) {
			return res.status(404).send();    
		}
        
		res.send({login});
	}).catch((e) => {
		res.status(400).send();
	});      
});
    



/** @description This command updates some information of a specific user. */

app.put('/users/:id', (req, res) => {
	var id = req.params.id;
	var schema = Joi.object().keys({
		email: Joi.string(),
		first_name: Joi.string(),
		last_name:Joi.string(),
		personal_phone:Joi.string(),
		password:Joi.string()
		})
	const newUser = {
		email: req.body.email,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		personal_phone: req.body.personal_phone,
		password: req.body.password
	}
	const {error, value} = Joi.validate(newUser, schema);
	if (error === null) {
		var updates = _.pick(req.body, [ 'email', 'first_name','last_name', 'personal_phone']);
		var pickPASS = _.pick(req.body, ['password']);
		if (pickPASS!= null) {
			var hash = bcrypt.hashSync(req.body.password);
			var JSONhash = {
				"password": hash
			};
			Login.findByIdAndUpdate(id, {$set: JSONhash}, {new: true}).then((login) => {
				if(!login) {
					return res.status(404).send();    
				}
			}).catch((e) => {
				res.status(400).send();
			});		
	} else {
		console.log('ERROR! You cannot create a new user like this. Please, retry.')
	};

	
	}
    
	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Login.findByIdAndUpdate(id, {$set: updates}, {new: true}).then((login) =>{
		if(!login) {
			return res.status(404).send();    
		}
        
		res.send(login);
	}).catch((e) => {
		res.status(400).send();
	});
    
});


/** @description This command removes a specific user. */

app.delete('/users/:id', (req, res) => {
	var id = req.body.id;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Login.findByIdAndDelete(id).then((login) => {
		if(!login) {
			return res.status(404).send();    
		}
		console.log('Removing the user of ID equal to:', id);
		res.status(200).send();
	}).catch((e) => {
		res.status(400).send();
	});      
});

/** @description This command login a specific user. */

app.post('/login', (req, res) => {
	var emailLOG = req.body.email;
	var passLOG = req.body.password;
	var accountOFemail = Login.find({email: emailLOG});
	var ComparePASS = bcrypt.compareSync(accountOFemail.password, passLOG)
	if (accountOFemail === undefined || accountOFemail === null) {
		return res.status(400).send();
	} else {
		if (ComparePASS === true) {
			var currentuser = {
				email: emailLOG,
				first_name: accountOFemail.first_name,
				last_name: accountOFemail.last_name,
				personal_phone: accountOFemail.personal_phone,
				_id: accountOFemail._id
			}
			res.send({currentuser});
		} else {
			return res.status(404).send();
		}
	}	 
});

/** @description This command logout a specific user. */

app.get('/logout', (req, res) => {   
		res.send(null);
	}).catch((e) => {
		res.status(400).send();
	});


module.exports = app;