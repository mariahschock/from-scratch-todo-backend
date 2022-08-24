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
const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const resp = await agent
    .post('/api/v1/users')
    .send({ ...mockUser, ...userProps });
  const user = resp.body;
  return [agent, user];
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

  it('GET /me returns currently logged in user', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/me');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('GET /me should return a 401 if not logged in', async () => {
    const resp = await request(app).get('/api/v1/users/me');
    expect(resp.status).toBe(401);
  });

  it('DELETE /api/v1/users/sessions should logout a session', async () => {
    const [agent, user] = await registerAndLogin();
    const deleteUser = await agent.delete('/api/v1/users/sessions');
    expect(deleteUser.status).toBe(204);
    const res = await agent.get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/todos should return a list of tasks', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/todos');
    expect(res.status).toBe(200);
    expect(res.body.tasks).toEqual([
      { id: '1', 
        task: 'Write README', 
        completed: false, 
        user_id: '1' },
      {
        id: '2',
        task: 'Make 5 LinkedIn connections',
        completed: true,
        user_id: '1'
      },
      {
        id: '3',
        task: 'Write R E T R O',
        completed: false,
        user_id: '1'
      }
    ]);
  });

  afterAll(() => {
    pool.end();
  });
});
