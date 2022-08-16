const express = require("express");

const app = express();

app.post("/create_link_token", (req, res) => {
    console.log(req);
    res.send({ link_token: "LINKTOKEN"});
});

module.exports = app;