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
exports.CoffeeController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
class CoffeeController {
    createCoffee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const coffeeBody = req.body;
            if (!coffeeBody.name || !coffeeBody.intensity || !coffeeBody.price) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                const coffee = yield services_1.CoffeeService.getInstance().createCoffee({
                    name: coffeeBody.name,
                    intensity: coffeeBody.intensity,
                    price: coffeeBody.price,
                    origin: coffeeBody.origin
                });
                res.json(coffee);
            }
            catch (err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        });
    }
    getAllCoffees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const coffees = yield services_1.CoffeeService.getInstance().getAll();
            res.json(coffees);
        });
    }
    getCoffee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coffee = yield services_1.CoffeeService.getInstance().getById(req.params.coffee_id);
                if (coffee === null) {
                    res.status(404).end();
                    return;
                }
                res.json(coffee);
            }
            catch (err) {
                res.status(400).end();
                return;
            }
        });
    }
    deleteCoffee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield services_1.CoffeeService.getInstance().deleteById(req.params.coffee_id);
                if (success) {
                    res.status(204).end();
                }
                else {
                    res.status(404).end();
                }
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    updateCoffee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coffee = yield services_1.CoffeeService.getInstance()
                    .updateById(req.params.coffee_id, req.body);
                if (!coffee) {
                    res.status(404).end();
                    return;
                }
                res.json(coffee);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        //router.use();
        router.use((0, middlewares_1.checkUserConnected)());
        router.post('/', express_1.default.json(), this.createCoffee.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllCoffees.bind(this));
        router.get('/:coffee_id', this.getCoffee.bind(this));
        router.delete('/:coffee_id', this.deleteCoffee.bind(this));
        router.put('/:coffee_id', express_1.default.json(), this.updateCoffee.bind(this));
        return router;
    }
}
exports.CoffeeController = CoffeeController;
