const mongoose = require('mongoose');
const { Schema, SchemaTypes, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: [true, 'Input contact name'],
    },
    email: {
      type: String,
      match: /^.*@.*$/,
      required: [true, 'Input contact email'],
    },
    phone: {
      type: String,
      match: /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/,
      required: [true, 'Input contact phone'],
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

contactsSchema.plugin(mongoosePaginate);

const Contact = model('contact', contactsSchema);

module.exports = Contact;
