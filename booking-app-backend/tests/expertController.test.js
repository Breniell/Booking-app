const request = require('supertest');
const app = require('../server');

describe('Expert API', () => {
  it('should create an expert profile', async () => {
    const response = await request(app)
      .post('/api/experts')
      .set('Authorization', `Bearer <your_jwt_token>`) // Replace with a valid token
      .send({
        userId: 1, // Replace with an existing user ID
        bio: 'Experienced consultant.',
        expertise: 'Business Strategy'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Expert profile created successfully');
  });
});
