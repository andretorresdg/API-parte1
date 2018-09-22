const request = require('supertest');
const app = require('../server/main');

describe('Test the root path', () => {
 test('It should respond the GET method', async () => {
   const response = await request(app).get('/users');
   expect(response.statusCode).toBe(200);
 });
});
