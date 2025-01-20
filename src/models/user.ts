import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import { APP_CONFIG } from '@Config/appConfig';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  getJWT(): Promise<string>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return isEmail(value);
        },
        message: '{VALUE} is not a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: 8,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age must be a positive number'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not supported',
      },
      required: [true, 'Gender is required'],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>('save', async function (next) {
  const user = this;

  if (user.isModified('email')) {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return next(new Error('Email already in use.'));
    }
  }

  if (!user.isModified('password')) return next();

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (err: any) {
    next(err);
  }
});

userSchema.methods.getJWT = async function () {
  const user = this;
  try {
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      APP_CONFIG.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    return token;
  } catch (err: any) {
    throw new Error('Error generating JWT token.');
  }
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this;
  try {
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
  } catch (err: any) {
    throw new Error('Password comparison failed. Please try again.');
  }
};

export const User = mongoose.model<IUser>('User', userSchema);
