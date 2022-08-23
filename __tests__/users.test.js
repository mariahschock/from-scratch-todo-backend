const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'hello@getshtdone.com',
  password: '123456',
  firstName: 'Karen',
  lastName: 'Jones',
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('POST - able to create new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email, firstName, lastName } = mockUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      email,
      firstName,
      lastName,
    });
  });
  
  afterAll(() => {
    pool.end();
  });
});
