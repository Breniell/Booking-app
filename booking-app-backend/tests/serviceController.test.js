const request = require('supertest');
const app = require('../server');

describe('Service API', () => {
  it('should create a new service', async () => {
    const response = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer <your_jwt_token>`) // Replace with a valid token
      .send({
        expertId: 1, // Replace with an existing expert ID
        name: 'Consultation',
        description: 'Business consultation service.',
        duration: 60,
        price: 1000.00
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Service created successfully');
  });
});
