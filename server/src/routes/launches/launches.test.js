const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('Test POST /launches', () => {
  const data = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    target: 'Kepler-186-f',
    launchDate: 'February 2, 2103',
  };

  const dataWithoutDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    target: 'Kepler-186-f',
  };

  const dataWithInvalidDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    target: 'Kepler-186-f',
    launchDate: 'Sheep',
  };

  test('It should respond with 201 success', async () => {
    const response = await request(app)
      .post('/launches')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(201);

    const requestDate = new Date(data.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(dataWithoutDate);
  });
  test('It should catch missing required properties', async () => {
    const response = await request(app)
      .post('/launches')
      .send(dataWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: 'Missing required launch property',
    });
  });
  test('It should catch invalid dates', async () => {
    const response = await request(app)
      .post('/launches')
      .send(dataWithInvalidDate)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: 'Invalid launch date',
    });
  });
});
