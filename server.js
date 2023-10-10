const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js'); 
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
// 设置CORS头部
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080'); // 允许访问的前端应用地址
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // 允许的请求方法
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允许的请求头部
  next();
});

mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Welcome to My Server!');
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  
  // Check if the user already exists
  if (await User.findOne({ username })) {
    return res.json({ success: false, message: 'User already exists' });
  }

  // Create a new user
  const user = new User({ username, password });
  await user.save();

  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user with this username
  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ success: false, message: 'User not found' });
  }

  // Check the password
  if (await bcrypt.compare(password, user.password)) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Wrong password' });
  }
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
