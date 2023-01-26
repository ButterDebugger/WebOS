const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    // Block forbidden files
    if (req.url.startsWith("/sys/old")) {
        res.status(403);
        return;
    }

    next();
});

app.get("/sys/license", (req, res) => {
    res.sendFile(path.join(__dirname, "LICENSE"));
});

app.get("/sys/readme.md", (req, res) => {
    res.sendFile(path.join(__dirname, "README.md"));
});

app.use(express.static(path.join(__dirname, "/public"), {
	extensions: ['html', 'htm']
}));

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});