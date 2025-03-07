const request = require('supertest');
const app = require('../server'); // Import your server

describe('User API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        firstName: 'kamga',
        lastName: 'victor',
        email: 'kamgavictor@gmail.com',
        password: 'securePassword',
        role: 'client'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should login an existing user', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'kamgavictor@gmail.com',
        password: 'securePassword'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
