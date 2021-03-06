/**
 * @fileOverview A script that populates the database with 85 fake users.
 * @author <a href="mailto:andretorresdg@usp.br">André Devay</a>
 * @version 1.0
 */

 /**
 * @module leite
 * @desc Contains utility functions for create random users.
 */
const Leite = require('leite');
const leite = new Leite();

 /**
 * @module bcrypt
 * @desc This module uses crypto to create random byte arrays .
 */

const bcrypt = require('bcrypt-nodejs');
var {Login} = require('./login.js');

/**
 * @module axios
 * @desc Make HTTP requests from node.js
 */

const axios = require('axios');
var i = 0;

async function funcAS(user) {
	try {
		const response = await axios({
			method:'post',
			url: 'http://localhost:3000/users',
			data: user
		});
		console.log("OK!Enviado")

		//console.log(response);
	} catch (error) {
		console.error(error);
	}
}

while (i<85) {
    i ++

    /** @type {number}
     * The creation of random CPF is used as the password of the fake users.
     */
    var typedPASS = leite.pessoa.rg()
    
    /** @type {string} */
    var emailFILL = leite.pessoa.email()

    /**@type {number} 
     * The creation of random age is used as the personal number of the fake users.
    */
    var numberFILL = leite.pessoa.idade({ min: 800000000, max: 999999999 });

    /** @type {string} */
    var nameFILL = leite.pessoa.nome()

    /** @type {string} */
    var surnameFILL = leite.pessoa.sobrenome();

    /** @type {string} */
    var phoneFILL = numberFILL.toString();

    /** @type {string} */
    var hash = bcrypt.hashSync(typedPASS);


    /** @type {object}
     * Represents a fake user
     */
    var leiteUser = new Login({
        email: emailFILL,
        first_name: nameFILL,
        last_name: surnameFILL,
        personal_phone: phoneFILL,
        password: hash            
	});
	
	console.log(leiteUser);
	funcAS(leiteUser)


}