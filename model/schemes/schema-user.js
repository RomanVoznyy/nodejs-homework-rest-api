const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      required: [true, 'Input user name'],
    },
    email: {
      type: String,
      unique: true,
      match: /^.*@.*$/,
      required: [true, 'Input user email'],
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 30,
      required: [true, 'Set password'],
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: 200 }, true);
      },
    },
    subscription: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
