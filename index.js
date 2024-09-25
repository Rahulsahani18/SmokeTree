const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Address = require('./models/address');

const app = express();
app.use(express.json()); // For parsing JSON data

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/user_addresses', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create a new user and address
app.post('/register', async (req, res) => {
  const { name, address } = req.body;

  try {
    // Create the user
    const user = new User({ name });
    await user.save();

    // Create the address and associate it with the user
    const newAddress = new Address({ address, user: user._id });
    await newAddress.save();

    // Associate the address with the user
    user.addresses.push(newAddress._id);
    await user.save();

    res.status(201).json({ message: 'User and address saved successfully', user, newAddress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save user or address' });
  }
});

// Get all users and their addresses
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('addresses');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
