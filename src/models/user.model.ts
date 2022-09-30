import { createJWToken } from '@config/auth';
import * as bcrypt from 'bcryptjs';

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: [6, 100],
      },
    },

    profile_picture: {
      type: DataTypes.STRING,
    },

    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'user'],
      defaultValue: 'user',
    },
  });

  User.associate = (db) => {
    db.User.hasMany(db.Food);

    db.User.hasMany(db.Order);

    db.User.hasMany(db.Address);
  };

  User.beforeSave((user, options) => {
    //console.log('before SAVE:   ', { user });
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
      //console.log('before SAVE:11111   ', { user });
    }
  });

  User.prototype.generateToken = function generateToken() {
    return createJWToken({
      id: this.id,
      role: this.role,
    });
  };

  User.prototype.authenticate = function authenticate(value) {
    if (bcrypt.compareSync(value, this.password)) return true;
    else return false;
  };

  User.generatePassword = function (password) {
    console.log(password);
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  };
  return User;
};