import {CartDocument, CartModel, CartProps} from "../models/cart.model";
import {RecipeDocument, RecipeModel, RecipeProps} from "../models/recipe.models";
import {Schema} from "mongoose";
import {UserDocument, UserModel, UserProps} from "../models";
import {RestoDocument, RestoModel} from "../models/restau.model";
import {ToolDocument, ToolModel, ToolProps} from "../models/tools.model";
export class RecipeService {
    private static instance?: RecipeService;
    public static getInstance(): RecipeService {
        if(RecipeService.instance === undefined) {
            RecipeService.instance = new RecipeService();
        }
        return RecipeService.instance;
    }
    private constructor() { }

    public async createRecipe(props: RecipeProps): Promise<RecipeDocument> {
        const model = new RecipeModel(props);
        const recipe = await model.save();
        return recipe;
    }

    async checkAlreadyExist(tittle:string,description:string){
       let tmp=await RecipeModel.find({tittle: tittle,desciption:description}).count().exec();
       console.log("compteur :",tmp)
        if (tmp===0){
            return false;
        }else{
            return true;
        }

    }

    async getAll(): Promise<RecipeDocument[]> {
        return RecipeModel.find().exec();
    }

    async getById(recipeId: string): Promise<RecipeDocument | null> {
        return RecipeModel.findById(recipeId).exec();
    }

    async deleteById(recipeId: string): Promise<boolean> {
        const res = await RecipeModel.deleteOne({_id: recipeId}).exec();
        if(res.deletedCount !== 1){
            console.log("toto",res.deletedCount)
            return false;
        }
        let cartContent=await CartModel.find({idRecipe:recipeId}).exec();
        let user=await UserModel.find().exec();
        let compteur:number=-1;
        for (let i=0; i<user.length;i++){
            for (let j=0; i<cartContent.length;j++) {
                compteur = user[i].cart.indexOf(cartContent[j].id);
                if (compteur!==-1){
                    user[i].cart.splice(compteur,1);
                    compteur=-1;
                }
            }
            compteur=-1;
        }
        return res.deletedCount === 1;
    }

    async updateById(recipeId: string, props: RecipeProps): Promise<RecipeDocument | null> {
        const recipe = await this.getById(recipeId);
        if(!recipe) {
            return null;
        }
        console.log(props.tittle,props.description);
        let tmp=await RecipeModel.find({tittle: props.tittle,description:props.description}).count().exec();
        let result=await RecipeModel.find({tittle: props.tittle,description:props.description}).exec();

        console.log("update",tmp,result)
        if(tmp===1 && result[0].id!==recipeId){
            return null;
        }
        if(props.tittle !== undefined) {
            recipe.tittle = props.tittle;
        }
        if(props.price !== undefined) {
            recipe.price = props.price;
        }
        if(props.description !== undefined) {
            recipe.description = props.description;
        }
        if(props.timeToPrepare !== undefined) {
            recipe.timeToPrepare = props.timeToPrepare;
        }
        if(props.ingredient !== undefined) {
            recipe.ingredient = props.ingredient;
        }
        if(props.instruction !== undefined) {
            recipe.instruction = props.instruction;
        }
        if(props.photo !== undefined) {
            recipe.photo = props.photo;
        }
        if(props.requirerTool !== undefined) {
            recipe.requirerTool = props.requirerTool;
        }
        if(props.type !== undefined) {
            recipe.type = props.type;
        }

        const res = await recipe.save();
        return res;
    }

}
