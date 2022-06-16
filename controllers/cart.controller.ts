import express, {Router, Request, Response} from "express";
import {CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {CartService} from "../services/cart.service";

export class CartController {

    async createCoffee(req: Request, res: Response) {
        const coffeeBody = req.body;
        if(!coffeeBody.name || !coffeeBody.intensity || !coffeeBody.price) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const coffee = await CoffeeService.getInstance().createCoffee({
                name: coffeeBody.name,
                intensity: coffeeBody.intensity,
                price: coffeeBody.price,
                origin: coffeeBody.origin
            });
            res.json(coffee);
        } catch(err) {
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
    }

    async getAllCoffees(req: Request, res: Response) {
        const coffees = await CoffeeService.getInstance().getAll();
        res.json(coffees);
    }

    async getCoffee(req: Request, res: Response) {
        try {
            const coffee = await CoffeeService.getInstance().getById(req.params.coffee_id);
            if(coffee === null) {
                res.status(404).end();
                return;
            }
            res.json(coffee);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteCoffee(req: Request, res: Response) {
        try {
            const success = await CoffeeService.getInstance().deleteById(req.params.coffee_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateCart(req: Request, res: Response) {
        try {
            const cart = await CartService.getInstance()
                .addItem(req.params.userId, req.body.content[0][0], req.body.content[1][0]);
            if(!cart) {
                res.status(404).end();
                return;
            }
            res.json(cart);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        //router.use();
        router.use(checkUserConnected(""));
        router.post('/', express.json(), this.createCoffee.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllCoffees.bind(this));
        router.get('/:coffee_id', this.getCoffee.bind(this));
        router.delete('/:coffee_id', this.deleteCoffee.bind(this));
        router.put('/:user_id', express.json(), this.updateCart.bind(this));
        return router;
    }
}
