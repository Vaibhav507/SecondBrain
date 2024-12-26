import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

const ContentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: ObjectId, ref: "tag", required: true }],
    userId: { type: ObjectId, ref: "user", required: true }
    
})

const TagSchema = new Schema({
    title: { type: String, required: true }
})

const LinkSchema = new Schema({
    userId: { type: ObjectId, ref: "user", required: true },
    hash: { type: String, required: true }
})

export const UserModel = mongoose.model("user", UserSchema);
export const TagModel = mongoose.model("tag", TagSchema);
export const ContentModel = mongoose.model("content", ContentSchema);
export const LinkModel = mongoose.model("link", LinkSchema);