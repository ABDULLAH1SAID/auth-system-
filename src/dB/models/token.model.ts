import mongoose, { Schema, Document, Model } from "mongoose";
export interface IToken extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const tokenSchema = new Schema<IToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Token = mongoose.model<IToken>("Token", tokenSchema);

export default Token;
