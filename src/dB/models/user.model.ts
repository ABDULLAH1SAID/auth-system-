import mongoose, { Schema, Document, Model } from "mongoose";


export enum Gender {
  Male = "male",
  Female = "female",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
  gender: Gender;
  googleId?: string;
  githubId?: string;
  avatar?: string;
}
// 3- Create the Schema
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    password: {
      type: String,
      required: function(this: IUser) {
        return !this.googleId && !this.githubId;
      },
      minlength: 6,
    },
    phone: {
      type: String,
      match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"],
    },
    address: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true
    },
    
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
