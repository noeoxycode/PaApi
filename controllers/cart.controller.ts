import express, {Router, Request, Response} from "express";
import {CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {CartService} from "../services/cart.service";
import {OrderDocument, OrderModel} from "../models/order.model";
import {UserDocument, UserModel} from "../models";
import {ToolModel, ToolProps} from "../models/tools.model";

export class CartController {

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

    async addTool(req: Request, res: Response){
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            const toolBody = req.body;
            try {
                const tool = await CartService.getInstance().asignToolToUser(req.params.tool_id, tmpUser);
                res.json(tool);
            } catch(err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        }
        else
            console.log("Error");
    }

    async addRecipeToCart(req: Request, res: Response){
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            try {
                const tool = await CartService.getInstance().addRecipeToCart(req.body, tmpUser);
                res.json(tool);
            } catch(err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        }
        else
            console.log("Error");
    }

    async addRecipeToWishList(req: Request, res: Response){
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            try {
                const tool = await CartService.getInstance().addRecipeToWishlist(req.body, tmpUser);
                res.json(tool);
            } catch(err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        }
        else
            console.log("Error");
    }

    async createTool(req: Request, res: Response) {
            const toolBody = req.body;
            if(!req.body.name || !req.body.photo || !req.body.description) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                const tool = await CartService.getInstance().createTool({
                    name: toolBody.name,
                    photo: toolBody.photo,
                    description: toolBody.description,
                });
                res.json(tool);
            } catch(err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
    }



   async deleteMaterial(req: Request, res: Response) {
         try {
                const success = await CartService.getInstance().deleteTool(req.params.tool_id);
                if(success) {
                    res.status(204).end();
                } else {
                    res.status(404).end();
                }
            } catch(err) {
                res.status(400).end();
            }
    }

    async removeRecipeFromCart(req: Request, res: Response) {
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            try {
                const success = await CartService.getInstance().removeRecipeFromCart(req.params.recipe_id, tmpUser);
                if(success) {
                    res.status(204).end();
                } else {
                    console.log("error");
                    res.status(404).end();
                }
            } catch(err) {
                res.status(400).end();
            }
        }
    }

    async removeRecipeFromWishlist(req: Request, res: Response) {
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            try {
                const success = await CartService.getInstance().removeRecipeFromWishlist(req.params.recipe_id, tmpUser);
                if(success) {
                    res.status(204).end();
                } else {
                    console.log("error");
                    res.status(404).end();
                }
            } catch(err) {
                res.status(400).end();
            }
        }
    }

    async getRecipeById(req: Request, res: Response) {
        try {
            const coffee = await CartService.getInstance().getRecipeById(req.params.recipe_id);
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

    async getAllRecipe(req: Request, res: Response) {
        console.log("coucou in get all recipe controller");
        const recipes = await CartService.getInstance().getAllRecipe();
        res.json(recipes);
    }

    buildRoutes(): Router {
        const router = express.Router();
        //router.use();
        router.use(checkUserConnected(""));
        router.post('/createTool', express.json(), this.createTool.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.delete('/deleteTool/:tool_id', express.json(), this.deleteMaterial.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.put('/addTool/:tool_id', express.json(), this.addTool.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.put('/addRecipeToCart', express.json(), this.addRecipeToCart.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.delete('/removeRecipeFromCart/:recipe_id', express.json(), this.removeRecipeFromCart.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/:recipe_id', this.getRecipeById.bind(this));
        router.get('/', this.getAllRecipe.bind(this));
        router.put('/addRecipeToWishList', express.json(), this.addRecipeToWishList.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.delete('/removeRecipeFromWishList/:recipe_id', express.json(), this.removeRecipeFromWishlist.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello

        return router;
    }
}
