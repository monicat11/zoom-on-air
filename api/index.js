const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
const lifx=require("lifxjs");
const getLifxDevices=require("./lifx.js");
const http = require("http");
// const app = express();
const app = require("./app");
const { exampleProxy } = require("./middleware/proxy.js");
const server = http.createServer(app);
require("dotenv").config();
require("./config/database").connect();

const PORT = process.env.PORT || 3001;

const devicePrefix = 'zoom_';
const participantJoinedEvent = 'meeting.participant_joined';
const participantLeftEvent = 'meeting.participant_left';

// app.use('/test', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
// app.use('/api',exampleProxy);

app.get("/api/test", (req, res) => {
    // res.json({ message: "Test from server!" });
    res.send("test api called");
    console.log("test api called");
});

app.post("/meetingEvent", (req, res) => {
    const authValid =
    request.headers['authorization'] === process.env.ZOOM_WEBHOOK_TOKEN;
    const event = request.body.event;
    const participant = request.body.payload.object.participant;

    const isParticipantEvent =
        event &&
        participant &&
        (event === participantJoinedEvent || event === participantLeftEvent);

    if (!authValid || !isParticipantEvent) {
        // just return a 200, we don't want zoom to keep retrying for a non-2xx error;
        return response.status(200).send({});
    }
    res.json({ message: "Received an event from webhook" });
    console.log('Zoom authenticated...');
    console.log('Event parse successful...');

    const isValidParticipant = participant.email === process.env.ZOOM_PARTICIPANT;
    if (!isValidParticipant) {
        return response.status(200).send({});
    }

    console.log('Zoom participant verified...');
    console.log('Connecting to LIFX...');

    const options = {
        appToken: process.env.LIFX_TOKEN
    };

    try {
        getLifxDevices();
    } catch (err) {
        console.log('LIFX ERROR: ', err);
    }

    response.status(200).send({});
});
  
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});