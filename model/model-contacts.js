const Contact = require('./schemes/schema-contacts');

const getAllContacts = async (
  userId,
  { sortBy, sortByDesc, filter, limit = '5', offset = '0' },
) => {
  const results = await Contact.paginate(
    { owner: userId },
    {
      limit,
      offset,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
      select: filter ? filter.split('|').join(' ') : '',
      populate: {
        path: 'owner',
        select: 'name email -_id',
      },
    },
  );
  const { docs: contacts, totalDocs: totalContacts } = results;
  return { totalContacts: totalContacts.toString(), limit, offset, contacts };
};

const getContactById = async (userId, contactId) => {
  return await Contact.findOne({ owner: userId, _id: contactId }).populate({
    path: 'owner',
    select: 'name email -_id',
  });
};

const addContact = async body => {
  return await Contact.create(body);
};

const updateContact = async (userId, contactId, body) => {
  return await Contact.findOneAndUpdate(
    { owner: userId, _id: contactId },
    { ...body },
    { new: true },
  ).populate({
    path: 'owner',
    select: 'name email -_id',
  });
};

const removeContact = async (userId, contactId) => {
  return await Contact.findOneAndRemove({ owner: userId, _id: contactId });
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
