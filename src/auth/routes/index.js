const express = require('express');
const base64 = require('js-base64');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authRoutes = express();
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'SET A TOKEN SECRET';
// Creating or logging in user with username and password using /signup and /signin routes
authRoutes.post('/signup', signUp);
authRoutes.post('/signin', signIn);

async function signUp(req, res, next) {
  const { username, password, role } = req.body;
  let auth = `${username}:${password}`;
  let encoded_auth = 'Basic ' + base64.encode(auth);
  console.log('ENCODED AUTH', encoded_auth);
  // add role of 'reader'
  let user = await User.createWithHashed(username, password, role);
  if (user) {
    res.status(201).json(user);
  } else {
    next(new Error('Failed to create an account.'));
  }
}

async function signIn(req, res, next) {
  let auth = req.header('Authorization');
  if (!auth.startsWith('Basic ')) {
    next(new Error('Invalid Login Scheme.'));
    return;
  }

  auth = base64.decode(auth.replace('Basic ', ''));
  console.log('Basic auth request', auth);
  const [username, password] = auth.split(':');
  let user = await User.findLoggedIn(username, password);
  if (user) {
    // res.status(200).send({ username: user.username });

    // add role: uer.role
    const data = { username: user.username, role: user.role };
    const jwtoken = jwt.sign(data, TOKEN_SECRET);

    // instead of sending username, send JWT
    res.send(jwtoken);
  } else {
    next(new Error('Invalid Login.'));
  }
}

// not going to use response
async function checkJWT(req, _, next) {
  const auth = req.header('Authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    next(new Error('Header does not contain Bearer.'));
    return;
  }
  try {
    const jwtoken = auth.replace('Bearer ', '');
    const decoded = jwt.verify(jwtoken, TOKEN_SECRET);
    req.username = decoded.username;
    req.role = decoded.role;
    next();
  } catch (err) {
    next(new Error('Could not decode auth', { cause: err }));
  }
}

function checkRole(roles) {
  return function ensureRole(req, _, next) {
    if (roles.includes(req.role)) {
      next();
    } else {
      next(new Error('Permission denied.'));
    }
  };
}

module.exports = {
  authRoutes,
  signIn,
  checkJWT,
  checkRole,
};
