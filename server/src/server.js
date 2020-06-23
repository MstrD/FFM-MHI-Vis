var express = require('express');
var app = express();

app.get('/maleColor', (req, res) => {
    res.send('male color');
});

app.get('/femaleColor', (req, res) => {
    res.send('female color');
});

app.listen(4000, () => {
    console.log('Server listening on port 4000');
})