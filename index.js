const express = require("express");
const mongoose = require("mongoose");
const shortId = require('short-unique-id');
const bodyParser = require("body-parser");
const { connectDB } = require("./db")
const Url = require("./models/urlmodel")
const app = express();
const PORT = 7000;
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(new Date());
    next();
})

app.get("/", (req, res) => {
    res.send("Welcome to URL Shortner")
})

app.get("/about", (req, res) => {
    res.send("A simple url shortner service created using Express and MongoDB")
})

const isValidUrl = url => {
    const urlRegex = /^(http|https):\/\/[\w.-]+(?:[:\d]*)\/\S+$/;
    return urlRegex.test(url);
}
app.post('/shorten', async (req, res) => {
    const { fullUrl } = req.body;

    if (!isValidUrl(fullUrl)) {
        return res.status(400).json({ message: 'Invalid URL' });
    }

    try {
        const existingUrl = await Url.findOne({ fullUrl });
        if (existingUrl) {
            return res.json({ shortId: existingUrl.shortId });
        }

        const shortId = shortId.generate();
        const newUrl = new Url({ fullUrl, shortId });
        await newUrl.save();

        res.json({ shortId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    try {
        const url = await Url.findOne({ shortId });
        if (url) {
            await Url.updateOne({ shortId }, { $inc: { clicks: 1 } });
            return res.redirect(url.fullUrl);
        }

        res.status(404).json({ message: 'Short URL not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT} ...`)
})