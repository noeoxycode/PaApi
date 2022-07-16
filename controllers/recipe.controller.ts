import express, {Router, Request, Response} from "express";
import {checkUserConnected} from "../middlewares";
import {UserDocument, UserModel} from "../models";
import {ProfileService} from "../services/profile.service";
import {RecipeService} from "../services/recipe.service";

export class RecipeController {

    getUserByTokenSession(reqHeader: string): Promise<UserDocument | null> {
        let idsession = "";
        if(reqHeader)
            idsession = reqHeader.slice(7);
        return UserModel.findOne({
            sessions : idsession
        }).exec();
    }



    async createRecipe(req: Request, res: Response) {
        const recipeBody = req.body;
        if(!recipeBody.tittle || !recipeBody.description || !recipeBody.price|| !recipeBody.timeToPrepare|| !recipeBody.ingredient|| !recipeBody.instruction|| !recipeBody.photo|| !recipeBody.type|| !recipeBody.price) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        if(await RecipeService.getInstance().checkAlreadyExist(recipeBody.tittle,recipeBody.description)){
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const recipe = await RecipeService.getInstance().createRecipe({
                tittle: recipeBody.tittle,
                description: recipeBody.description,
                price: recipeBody.price,
                ingredient: recipeBody.ingredient,
                instruction: recipeBody.instruction,
                photo: recipeBody.photo,
                requirerTool: recipeBody.requirerTool,
                type: recipeBody.type,
                timeToPrepare: recipeBody.timeToPrepare
            });
            res.json(recipe);
        } catch(err) {
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
    }

    async getAllRecipes(req: Request, res: Response) {
        const recipes = await RecipeService.getInstance().getAll();
        res.json(recipes);
    }

    async getRecipe(req: Request, res: Response) {
        try {
            const recipe = await RecipeService.getInstance().getById(req.params.recipe_id);
            if(recipe === null) {
                res.status(404).end();
                return;
            }
            res.json(recipe);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteRecipe(req: Request, res: Response) {
        try {
            const success = await RecipeService.getInstance().deleteById(req.params.recipe_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateRecipe(req: Request, res: Response) {
        try {
            const recipe = await RecipeService.getInstance()
                .updateById(req.params.recipe_id, req.body);
            if(!recipe) {
                res.status(404).end();
                return;
            }
            res.json(recipe);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        //router.use();
        router.use(checkUserConnected("Admin"));
        router.post('/', express.json(), this.createRecipe.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllRecipes.bind(this));
        router.get('/:recipe_id', this.getRecipe.bind(this));
        router.delete('/:recipe_id', this.deleteRecipe.bind(this));
        router.put('/:recipe_id', express.json(), this.updateRecipe.bind(this));
        return router;
    }
}
