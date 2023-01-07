const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const COMPLEXITY = 10;

function createUser(sequelize) {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING, // 'user', 'admin'
  });

  User.createWithHashed = async (username, password, role) => {
    password = await bcrypt.hash(password, COMPLEXITY);
    console.log('Creating a new user', username, password, role);
    const user = await User.create({ username, password, role });
    return user;
  };

  User.findLoggedIn = async (username, password) => {
    const user = await User.findOne({ where: { username } });
    if (user === null) {
      return null;
    }
    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  };
  return User;
}

module.exports = { createUser };
