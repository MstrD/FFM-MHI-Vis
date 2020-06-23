const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const settingsDir = 'src/settings/settings.json';

function readSetting(setting) {
    const data = fs.readFileSync(settingsDir);
    let settings = JSON.parse(data);
    return settings[setting];
}

function writeSetting(setting, value) {
    const data = fs.readFileSync(settingsDir);
    let settings = JSON.parse(data);
    settings[setting] = value;
    let newData = JSON.stringify(settings, null, 2);
    fs.writeFile(settingsDir, newData, (err) => {
        if (err) throw err;
        console.log('Data written to file!');
    });
}

app.get('/settings/maleColor', (req, res) => {
    res.send(readSetting('maleColor'));
});

app.get('/settings/femaleColor', (req, res) => {
    res.send(readSetting('femaleColor'));
});

app.post('/settings/maleColor', (req, res) => {
    writeSetting('maleColor', req.body.maleColor);
    res.send('Male color changed!');
});

app.post('/settings/femaleColor', (req, res) => {
    writeSetting('femaleColor', req.body.femaleColor);
    res.send('Female color changed!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));