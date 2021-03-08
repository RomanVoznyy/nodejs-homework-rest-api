const contactsModel = require('../model/model-contacts');
const { StatusCode } = require('../helpers/constants');

const getAll = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contacts = await contactsModel.getAllContacts(userId, req.query);

    return res.status(StatusCode.SUCCESS).json({
      status: 'success',
      code: StatusCode.SUCCESS,
      data: {
        ...contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getByid = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contact = await contactsModel.getContactById(
      userId,
      req.params.contactId,
    );
    if (contact) {
      return res.status(StatusCode.SUCCESS).json({
        status: 'success',
        code: StatusCode.SUCCESS,
        data: {
          contact,
        },
      });
    } else {
      return res.status(StatusCode.NOT_FOUND).json({
        status: 'error',
        code: StatusCode.NOT_FOUND,
        message: 'Not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contact = await contactsModel.addContact({
      ...req.body,
      owner: userId,
    });
    return res.status(StatusCode.CREATED).json({
      status: 'success',
      code: StatusCode.CREATED,
      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contact = await contactsModel.updateContact(
      userId,
      req.params.contactId,
      req.body,
    );
    if (contact) {
      return res.status(StatusCode.SUCCESS).json({
        status: 'success',
        code: StatusCode.SUCCES,
        data: {
          contact,
        },
      });
    } else {
      return res.status(StatusCode.NOT_FOUND).json({
        status: 'error',
        code: StatusCode.NOT_FOUND,
        message: 'Not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contact = await contactsModel.removeContact(
      userId,
      req.params.contactId,
    );
    if (contact) {
      return res.status(StatusCode.SUCCESS).json({
        status: 'success',
        code: StatusCode.SUCCESS,
        message: 'contact deleted',
      });
    } else {
      return res.status(StatusCode.NOT_FOUND).json({
        status: 'error',
        code: StatusCode.NOT_FOUND,
        message: 'Not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getByid,
  create,
  update,
  remove,
};
