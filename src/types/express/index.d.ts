declare namespace Express {
  interface Request {
    user?: IUser;
  }
}

interface Iuser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  comparePassword(candidatePassword: string): Promise<boolean>;
}
