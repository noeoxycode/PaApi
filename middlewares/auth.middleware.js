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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserConnected = void 0;
const services_1 = require("../services");
function checkUserConnected() {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            if (parts.length !== 2) {
                res.status(401).end();
                return;
            }
            if (parts[0] !== 'Bearer') {
                res.status(401).end();
                return;
            }
            const token = parts[1];
            try {
                const user = yield services_1.AuthService.getInstance().getUserFrom(token);
                if (user === null) {
                    res.status(401).end();
                    return;
                }
                req.user = user;
                next();
            }
            catch (err) {
                res.status(401).end();
            }
        });
    };
}
exports.checkUserConnected = checkUserConnected;
