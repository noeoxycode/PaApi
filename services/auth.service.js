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
exports.AuthService = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const session_model_1 = require("../models/session.model");
class AuthService {
    constructor() { }
    static getInstance() {
        if (AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    subscribeUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.password) {
                throw new Error('Missing password');
            }
            const model = new models_1.UserModel({
                login: user.login,
                password: utils_1.SecurityUtils.sha512(user.password)
            });
            return model.save();
        });
    }
    // Pick selectionne des champs dans le type
    logIn(info, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.UserModel.findOne({
                login: info.login,
                password: utils_1.SecurityUtils.sha512(info.password)
            }).exec();
            if (user === null) {
                throw new Error('User not found');
            }
            // 604_800 -> 1 week in seconds
            const currentDate = new Date();
            const expirationDate = new Date(currentDate.getTime() + 604800000);
            const session = yield session_model_1.SessionModel.create({
                platform,
                expiration: expirationDate,
                user: user._id
            });
            user.sessions.push(session._id); // permet de memoriser la session dans le user
            yield user.save();
            return session;
        });
    }
    getUserFrom(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield session_model_1.SessionModel.findOne({
                _id: token,
                expiration: {
                    $gte: new Date()
                }
            }).populate("user").exec();
            return session ? session.user : null;
        });
    }
}
exports.AuthService = AuthService;
