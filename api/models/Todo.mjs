import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TodoSchema = new Schema({
    todo: { type: String, required: true },
    username: { type: String, required: true }
})

const TodoModel = model('Todo', TodoSchema);
export { TodoModel };