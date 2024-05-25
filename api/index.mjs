import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { UserModel as User } from './models/User.mjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { TodoModel as Todo } from './models/Todo.mjs';

const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(cookieParser())

await mongoose.connect('mongodb+srv://kumar699abhishek:dqhvXo1rOG6LJ0K9@cluster0.zvig6ia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.get('/', (req, res) => {
    res.send('hi')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({ username, password });
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = password === userDoc.password;
    if (passOk) {
        // logged in
        const token = jwt.sign({ username, id: userDoc._id }, 'secret', {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                username,
                id: userDoc._id,
            })
        })
    } else {
        res.status(400).json('Wrong Credentials')
    }
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, 'secret', {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token','').json('ok')
})

app.listen(8000, () => {
    console.log('listening on port: ', 8000)
})

app.post('/:username/addtodo', async(req, res) => {
    const {username} = req.params;
    const {todo} = req.body;
    const todoDoc = await Todo.create({todo,username});

    res.json(todoDoc)
})

// app.get('/:username', async (req, res) => {
//     const {username} = req.params;
//     const todos = await Todo.find({username});
//     res.json(todos);
// })

app.get('/:username/todos', async (req, res) => {
    const {username} = req.params;
    const todosDoc = await Todo.find({username});
    res.json(todosDoc);
})

app.post('/:username/deletetodo', async (req, res) => {
    const {username} = req.params;
    const {todo} = req.body
    await Todo.deleteOne({todo, username});
    res.json('ok')
})


//dqhvXo1rOG6LJ0K9
//mongodb+srv://kumar699abhishek:dqhvXo1rOG6LJ0K9@cluster0.zvig6ia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0