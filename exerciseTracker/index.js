const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./db/mongoose.connect.ts');
const { User, Exercise } = require('./model/model.ts');
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dateFormatter = (date) => {
  date = new Date(date);

  // Get individual parts
  const weekday = date.toLocaleString('en-US', { weekday: 'short' }); // Mon
  const month = date.toLocaleString('en-US', { month: 'short' }); // Jan
  const day = String(date.getDate()).padStart(2, '0'); // 01
  const year = date.getFullYear(); // 1990

  date = `${weekday} ${month} ${day} ${year}`;
  return date;
};

app.post('/api/users', async (req, res) => {
  const { username: name } = req.body;
  const user = new User({
    username: name,
  });
  await user.save();
  const { username, _id } = user;
  res.send({
    username,
    _id,
  });
});

app.get('/api/users', async (req, res) => {
  const users = await User.find({});
  const userArr = users.map((user) => {
    return {
      username: user.username,
      _id: user._id,
    };
  });
  res.json(userArr);
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const { _id } = req.params;
    let { description, duration, date } = req.body;

    if (date) {
      date = dateFormatter(date);
    } else date = new Date().toDateString();
    const exercise = new Exercise({
      userId: _id,
      description,
      duration,
      date,
    });
    await exercise.save();
    const { username } = await User.findById(_id);

    res.json({ _id, username, description, duration: Number(duration), date });
  } catch (error) {
    res.json({
      name: error.name,
      message: error.message,
    });
  }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  const user = await User.findById(_id);
  const exercise = await Exercise.find({ userId: _id })
    .select('description duration date -_id')
    .limit(limit);
  const { username } = user;

  const formattedLogs = exercise.map((ex) => {
    return {
      description: ex.description,
      duration: Number(ex.duration),
      date: dateFormatter(ex.date),
    };
  });
  res.json({
    username,
    _id,
    count: limit ?? exercise.length,
    log: formattedLogs,
  });
});

const exercise = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ');
});
