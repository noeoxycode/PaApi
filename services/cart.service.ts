import {CartDocument, CartModel, CartProps} from "../models/cart.model";
import {RecipeDocument, RecipeModel, RecipeProps} from "../models/recipe.models";
import {Schema} from "mongoose";
import {UserDocument, UserModel} from "../models";
import {RestoDocument, RestoModel} from "../models/restau.model";
export class CartService {
    private static instance?: CartService;
    public static getInstance(): CartService {
        if(CartService.instance === undefined) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }
    private constructor() { }

    public async createCart(props: CartProps): Promise<CartDocument> {
        const model = new CartModel(props);
        const cart = await model.save();
        return cart;
    }

    async getAll(): Promise<CartDocument[]> {
        return CartModel.find().exec();
    }

    async getRecipeById(recipeId: string): Promise<RecipeDocument | null> {
        return RecipeModel.findById(recipeId).exec();
    }

    async getUserById(userId: string): Promise<UserDocument | null> {
        return await UserModel.findById(userId).exec();
    }

    async deleteById(cartId: string): Promise<boolean> {
        const res = await CartModel.deleteOne({_id: cartId}).exec();
        return res.deletedCount === 1;
    }

    async addItem(userId: string, recipeId: string, number: number): Promise<UserDocument | null> {
        const user = await this.getUserById(userId);
        if(!user) {
            return null;
        }
        const tmp = await this.getRecipeById(recipeId);
        console.log("tmp in addItem", tmp);
        if(tmp !== undefined) {
            console.log("le user avant le push", user.cart.content);
            user.cart.content.push(recipeId, number);
            console.log("le user apres le push", user);
        }
        console.log("coucou before save" );
        const res = await user.save();
        console.log("res displayed at the end : ", res);
        return res;
    }
}
