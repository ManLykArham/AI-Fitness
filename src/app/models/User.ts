import mongoose, { Document, Schema } from "mongoose";

// Define the User interface to represent the document in TypeScript
export interface IUser extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
}

// Create a Schema corresponding to the document interface.
const userSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create a Model.
const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;
