const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path');
const port = process.env.PORT || 3001;

let users;

if (process.env.NODE_ENV === 'production') {
    users = JSON.parse(process.env.USERS);
} else {
    users = [
        { username: 'Loki', password: 'aaaaaaaaaaaaa' },
        { username: 'Aqua', password: 'bbbbbbbbbbbbb' },
        { username: 'Athena', password: 'ccccccccccccc' }
    ];
}

app.use(bodyParser.text());

app.get('/', (req, res) => res.type('html').status(404).sendFile(path.join(__dirname + '/404.html')));
app.get('/404.js', (req, res) => res.type('js').sendFile(path.join(__dirname + '/404.js')));
app.get('/styles.css', (req, res) => res.type('css').sendFile(path.join(__dirname + '/styles.css')));

app.put('/index.html', (req, res) => res.type('html').sendFile(path.join(__dirname + '/index.html')));

app.post('/verify-password', (req, res) => {
    let response = false;

    users.forEach(user => {
        if (req.body === user.password) {
            response = user.username;
        }
    });

    res.json(response);
});

app.get('/script.js', (req, res) => res.type('js').sendFile(path.join(__dirname + '/script.js')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
