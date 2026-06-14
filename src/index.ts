import Express from "express";
import { ENV } from "./config/env";

const app = Express();

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

const PORT = ENV.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});