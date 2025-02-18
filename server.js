const express = require("express");
const app = express();

app.use(express.json());

// Use CORS middleware so we can make requests across origins
app.use(cors());

app.get("/", (req, res) => {
    res.send("Bloggle Backend is set up and running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
