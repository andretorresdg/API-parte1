/**
 * @fileOverview This file is a Jest test and it should respond the POST method
 * @author <a href="https://www.linkedin.com/in/andredevay/"> André Devay </a>
 * @version 1.0
 */

const request = require('supertest');
const app = require('../server/app');

describe('Test the root path', () => {
	test('It should respond the POST method', async () => {
		const response = await request(app).post('/users')
			.send({
				email: 'barney@nowhere.com',
				first_name: 'Barney',
				last_name: 'Flintstone',
				personal_phone: '534534534',
				password: 'anothersecret',
			}).set('Accept', 'application/json');
		expect(response.statusCode).toBe(200);
	});
});
