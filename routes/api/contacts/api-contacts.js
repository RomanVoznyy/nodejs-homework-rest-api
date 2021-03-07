const express = require('express');
const router = express.Router();
const ctrl = require('../../../controller/contacts');
const guard = require('../../../helpers/guard');
const validate = require('./valid-contacts');

router
  .get('/', guard, ctrl.getAll)
  .post('/', guard, validate.createContact, ctrl.create);

router
  .get('/:contactId', guard, ctrl.getByid)
  .patch('/:contactId', guard, validate.updateContact, ctrl.update)
  .delete('/:contactId', guard, ctrl.remove);

module.exports = router;
