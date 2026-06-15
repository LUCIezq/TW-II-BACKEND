import Express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { authRouter } from './modules/auth/auth.router';

const app = Express();

app.use(cors());
app.use(Express.json());

app.use('/api/auth', authRouter);

app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
});