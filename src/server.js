import './setup.js';
import app from './app.js';

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000;

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${port}`);
});
