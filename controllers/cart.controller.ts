import express, {Router, Request, Response} from "express";
import {CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {CartService} from "../services/cart.service";
import {OrderDocument, OrderModel} from "../models/order.model";
import {UserDocument, UserModel} from "../models";
import {ToolModel, ToolProps} from "../models/tools.model";
import {CartDocument, CartModel} from "../models/cart.model";

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
        else {
            console.log("Error");
        }
    }

    async getCartById(req: Request, res: Response) {
        try {
            const cart = await CartService.getInstance().getCartModelById(req.params.cart_id);
            if(cart === null) {
                res.status(404).end();
                return;
            }
            res.json(cart);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async updateCart(req: Request, res: Response){
        if(req.headers.authorization){
            const tmpCart = await CartService.getInstance().getCartModelById(req.params.cart_id);
            try {
                const cart = await CartService.getInstance().updateCart(tmpCart,req.body);
                if(!cart) {
                    res.status(404).end();
                    return;
                }
                res.json(cart);
            } catch(err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        }
        else {
            res.status(401).end();
            console.log("Error");
        }
    }

    async addRecipeToWishList(req: Request, res: Response){
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            try {
                const tool = await CartService.getInstance().addRecipeToWishlist(req.params.recipe_id, tmpUser);
                res.json(tool);
            } catch(err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        }
        else
            console.log("Error");
    }

    async addRecipeToFavorite(req: Request, res: Response){
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            try {
                const tool = await CartService.getInstance().addRecipeToFavorite(req.params.recipe_id, tmpUser);
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

    async removeRecipeFromFavorite(req: Request, res: Response) {
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            try {
                const success = await CartService.getInstance().removeRecipeFromFavorite(req.params.recipe_id, tmpUser);
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

    async getToolById(req: Request, res: Response) {
        try {
            const tool = await CartService.getInstance().getToolById(req.params.tool_id);
            if(tool === null) {
                res.status(404).end();
                return;
            }
            res.json(tool);
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

    async getCartContent(req: Request, res: Response) {
        console.log("coucou in get all cart controller");
        if(req.user===undefined){
            console.log("a")
            res.status(401).end();
            return;
        }
        try {
            console.log("coucou f");
                let recipes = await CartService.getInstance().getAllCartContent(req.user.cart);
                res.json(recipes);


        }catch(err){
            console.log("b")
            res.status(402).end();
            return;
        }
        res.status(405).end();
        return;

    }

    async getAllTool(req: Request, res: Response) {
        console.log("coucou in get all tool controller");
        const tools = await CartService.getInstance().getAllTool();
        res.json(tools);
    }

    buildRoutes(): Router {
        const router = express.Router();
        //router.use();
        router.use(checkUserConnected(""));
        router.get('/content', this.getCartContent.bind(this));
        router.post('/createTool', express.json(), this.createTool.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.delete('/deleteTool/:tool_id', express.json(), this.deleteMaterial.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.put('/addTool/:tool_id', express.json(), this.addTool.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/allTool', this.getAllTool.bind(this));
        router.get('/tool/:tool_id', this.getToolById.bind(this));
        router.put('/addRecipeToCart', express.json(), this.addRecipeToCart.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/:cart_id', this.getCartById.bind(this));
        router.put('/updateCart/:cart_id', express.json(), this.updateCart.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.delete('/removeRecipeFromCart/:recipe_id', express.json(), this.removeRecipeFromCart.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/recipe/:recipe_id', this.getRecipeById.bind(this));
        router.get('/', this.getAllRecipe.bind(this));
        router.put('/addRecipeToWishList/:recipe_id', express.json(), this.addRecipeToWishList.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.delete('/removeRecipeFromWishList/:recipe_id', express.json(), this.removeRecipeFromWishlist.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.put('/addRecipeToFavorite/:recipe_id', express.json(), this.addRecipeToFavorite.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.delete('/removeRecipeFromFavorite/:recipe_id', express.json(), this.removeRecipeFromFavorite.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello

        return router;
    }
}
