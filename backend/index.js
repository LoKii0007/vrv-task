const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./db');
const router = require('./routes/route');
const cors = require('cors');
const cookieParser = require('cookie-parser');

connectDB();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://vrv-task-frontend.vercel.app'],
    credentials: true,
}));
app.use(cookieParser());
app.use('/', router)