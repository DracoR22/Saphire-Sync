"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middleware/auth");
const paymentRouter = express_1.default.Router();
paymentRouter.get('/payment/stripepublishablekey', payment_controller_1.sendStripePublishableKey);
paymentRouter.post('/payment', auth_1.isAuthenticated, payment_controller_1.newPayment);
exports.default = paymentRouter;
