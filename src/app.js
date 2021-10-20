import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Ok');
});

app.listen(4000);