"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
class AuthController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield services_1.AuthService.getInstance().subscribeUser({
                    login: req.body.login,
                    password: req.body.password
                });
                res.json(user);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    logUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const platform = req.headers['user-agent'] || "Unknown";
            try {
                const session = yield services_1.AuthService.getInstance().logIn({
                    login: req.body.login,
                    password: req.body.password
                }, platform);
                res.json({
                    token: session === null || session === void 0 ? void 0 : session._id
                });
            }
            catch (err) {
                res.status(401).end(); // unauthorized
            }
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(req.user);
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.post('/subscribe', express_1.default.json(), this.createUser.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.post('/login', express_1.default.json(), this.logUser.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/me', (0, middlewares_1.checkUserConnected)(), this.me.bind(this));
        return router;
    }
}
exports.AuthController = AuthController;
