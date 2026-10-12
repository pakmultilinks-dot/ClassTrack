const stripMongoFields = (_doc, returnedObject) => {
  delete returnedObject._id;
  delete returnedObject.__v;
  return returnedObject;
};

module.exports = {
  timestamps: true,
  id: false,
  toJSON: {
    transform: stripMongoFields
  },
  toObject: {
    transform: stripMongoFields
  }
};
