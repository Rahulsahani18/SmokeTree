const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
