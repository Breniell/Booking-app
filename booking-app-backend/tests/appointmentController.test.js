const request = require('supertest');
const app = require('../server');

describe('Appointment API', () => {
  it('should create a new appointment', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer <your_jwt_token>`) // Replace with a valid token
      .send({
        clientId: 1, // Replace with an existing client ID
        expertId: 1, // Replace with an existing expert ID
        serviceId: 1, // Replace with an existing service ID
        startTime: '2025-02-16T10:00:00Z',
        endTime: '2025-02-16T11:00:00Z'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Appointment created successfully');
  });
});
