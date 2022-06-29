import express, {Router, Request, Response} from "express";
import {CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {CartService} from "../services/cart.service";
import {OrderDocument, OrderModel} from "../models/order.model";
import {UserDocument, UserModel} from "../models";
import {ToolModel, ToolProps} from "../models/tools.model";

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

    getUserById(orderId: string): Promise<UserDocument | null> {
        return UserModel.findById(orderId).exec();
    }

    getUserByTokenSession(reqHeader: string): Promise<UserDocument | null> {
        console.log("coucou in cirnge name", reqHeader);
        let idsession = "";
        if(reqHeader)
            idsession = reqHeader.slice(7);
        return UserModel.findOne({
            sessions : idsession
        }).exec();
    }
/*
    async addItemToCart(req: Request, res: Response) {
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);

            const toolBody = req.body;
            if(!toolBody.content || !toolBody.customerId || !toolBody.status || !toolBody.numberCart) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                const tool = await CartService.getInstance().addTool({
                    name: toolBody.name,
                    photo: toolBody.photo,
                    description: toolBody.description,
                }, tmpUser);
                res.json(tool);
            } catch(err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        }
        else
            console.log("Error");
    }
   */
    async addTool(req: Request, res: Response){
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            const toolBody = req.body;
            try {
                const tool = await CartService.getInstance().addTool(req.params.tool_id, tmpUser);
                res.json(tool);
            } catch(err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        }
        else
            console.log("Error");
    }
/*
    async coucou(req: Request, res: Response) {
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);

            const toolBody = req.body;
            if(!toolBody.name || !toolBody.photo || !toolBody.description) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                const tool = await CartService.getInstance().addTool({
                    name: toolBody.name,
                    photo: toolBody.photo,
                    description: toolBody.description,
                }, tmpUser);
                res.json(tool);
            } catch(err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        }
        else
            console.log("Error");
    }
*/
   async deleteMaterial(req: Request, res: Response) {
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            try {
                const success = await CartService.getInstance().deleteTool(tmpUser, req.params.tool_id);
                if(success) {
                    res.status(204).end();
                } else {
                    res.status(404).end();
                }
            } catch(err) {
                res.status(400).end();
            }
        }
        else
            console.log("Error");
    }



    buildRoutes(): Router {
        const router = express.Router();
        //router.use();
        router.use(checkUserConnected(""));
        router.post('/addTool', express.json(), this.addTool.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.delete('/deleteTool/:tool_id', express.json(), this.deleteMaterial.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.put('/addTool/:tool_id', express.json(), this.addTool.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello

      return router;
    }
}
