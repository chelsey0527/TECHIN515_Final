import express from 'express';

import userRouter from './routes/user.router';
import homeRouter from './routes/home.router';
import pillcaseRouter from './routes/pillcase.router';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/users', userRouter);
app.use('/home', homeRouter);
app.use('/pillcase', pillcaseRouter);

app.listen(port, () => {
    console.log(`server running on ${port}`);
});