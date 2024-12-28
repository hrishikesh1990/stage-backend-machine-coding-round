import * as jwt from 'jsonwebtoken';
const secret = 'my_stage_app';

const payload = { username: 'user2' };

const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log("Generated jwt token: ", token);