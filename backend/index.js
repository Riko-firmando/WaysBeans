const express = require("express");
const router = require("./src/routes");
const cors = require("cors");

//Get routes to the variabel here

const port = 5000;
const app = express();

app.use(express.json());
app.use(cors());

//Create endpoint grouping and router here
app.use("/api/v1/", router);

// to serving static file
app.use("/uploads", express.static("uploads"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
