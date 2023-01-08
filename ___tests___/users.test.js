'use strict';

const b64 = require('js-base64');
const { sequelize } = require('../src/models');
const { User } = require('../src/auth/models');
const { signIn } = require('../src/auth/routes/index');


describe('Auth Routes', () => {
  it('returns a web token for a sign in route', async () => {
    // arrange
    await sequelize.sync();
    await User.createWithHashed('Maru', 'pip1');

    // act
    const req = {
      header: jest.fn().mockImplementation((header) => {
        if (header === 'Authorization') {
          return 'Basic ' + b64.encode('Maru:pip1');
        }
        return '';
      }),
    };
    const res = { send: jest.fn() };
    const next = jest.fn();
    await signIn(req, res, next);

    // assert
    const token = res.send.mock.lastCall[0];
    const [_header, payloadBase64, _signature] = token.split('.');
    const payload = JSON.parse(b64.decode(payloadBase64));
    expect(payload.username).toBe('Maru');
  });
});