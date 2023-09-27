"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./utils/db"));
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const socketServer_1 = require("./socketServer");
require("dotenv").config();
const server = http_1.default.createServer(app_1.app);
// Cloudinary Config        
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});
// Run Socket Server
(0, socketServer_1.initSocketServer)(server);
// Run Server
server.listen(process.env.PORT, () => {
    (0, db_1.default)();
    console.log(`Server is connected to port ${process.env.PORT}`);
});
