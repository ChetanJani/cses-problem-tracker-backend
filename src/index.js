import "./env.js";
import app from "./app.js";
import connectDatabase from "./db/mongodb.js";
import chalk from "chalk";

const port = process.env.PORT || 8081;

connectDatabase()
    .then(() => {
        app.listen(port, "localhost", () => {
            console.log(
                `Application is running on ` +
                    chalk.yellow(`'http://localhost:${port}'`),
            );
        });
    })
    .catch((err) => {
        console.error(chalk.red(`❌Failed to Connect DB`), err);
        process.exit(1);
    });
