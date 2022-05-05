const jwt = require('jsonwebtoken');
const Base = require('./Base');

const users = [{
  id: 123,
  role: 'basic',
  name: 'Basic Thomas',
  username: 'basic-thomas',
  password: 'sR-_pcoow-27-6PAwCD8',
},
{
  id: 434,
  role: 'premium',
  name: 'Premium Jim',
  username: 'premium-jim',
  password: 'GBLtTyq3E_UNjFnpo9m6',
},
];

class AuthService extends Base {
  async login(req) {
    const {
      body: {
        username,
        password,
      },
    } = req;

    const user = users.find((u) => u.username === username);

    if (!user || user.password !== password) {
      throw new Error('invalid-auth-credentials');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        role: user.role,
      },
      this.config.get('JWT_SECRET'),

      {
        issuer: 'https://www.test.com/',
        subject: `${user.id}`,
        expiresIn: 30 * 60,
      },
    );

    return {
      token,
    };
  }
}
module.exports = AuthService;
