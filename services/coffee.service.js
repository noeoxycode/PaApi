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
exports.CoffeeService = void 0;
const models_1 = require("../models");
class CoffeeService {
    constructor() { }
    static getInstance() {
        if (CoffeeService.instance === undefined) {
            CoffeeService.instance = new CoffeeService();
        }
        return CoffeeService.instance;
    }
    createCoffee(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new models_1.CoffeeModel(props);
            const coffee = yield model.save();
            return coffee;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.CoffeeModel.find().exec();
        });
    }
    getById(coffeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.CoffeeModel.findById(coffeeId).exec();
        });
    }
    deleteById(coffeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield models_1.CoffeeModel.deleteOne({ _id: coffeeId }).exec();
            return res.deletedCount === 1;
        });
    }
    updateById(coffeeId, props) {
        return __awaiter(this, void 0, void 0, function* () {
            const coffee = yield this.getById(coffeeId);
            if (!coffee) {
                return null;
            }
            if (props.name !== undefined) {
                coffee.name = props.name;
            }
            if (props.price !== undefined) {
                coffee.price = props.price;
            }
            if (props.origin !== undefined) {
                coffee.origin = props.origin;
            }
            if (props.intensity !== undefined) {
                coffee.intensity = props.intensity;
            }
            const res = yield coffee.save();
            return res;
        });
    }
}
exports.CoffeeService = CoffeeService;
