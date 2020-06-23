const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/settings/maleColor', (req, res) => {
    res.send(settings.maleColor);
});

app.get('/settings/femaleColor', (req, res) => {
    res.send(settings.femaleColor);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// variables that can be changed
var settings = {
    maleColor: '#FFA500',
    femaleColor: '#1976D2'
};