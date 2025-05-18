import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
});

const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: Date,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export const User = mongoose.model('User', userSchema);
export const Exercise = mongoose.model('Exercise', exerciseSchema);
