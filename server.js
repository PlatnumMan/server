import express from "express";
import chalk from "chalk";
const morgan = require("morgan");
import cors from "cors";
import mongoose from "mongoose";
import { readdirSync } from "fs";
require("dotenv").config();

const app = express();

// Database
mongoose.connect(process.env.DATABASE)
.then(() => console.log(chalk.bgCyan("[DATABASE] Connected to database")))
.catch(err => console.log(chalk.bgRed("[DATABASE] Error connecting to database")));

// Middlewares
app.use(cors())
app.use(express.json());
app.use(morgan("dev"));

// Routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(chalk.bgBlue(`[SERVER] is running on port ${port}`));
});
