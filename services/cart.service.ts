import {CartDocument, CartModel, CartProps} from "../models/cart.model";
import {RecipeDocument, RecipeModel} from "../models/recipe.models";
import {Schema} from "mongoose";
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

    async getCartByUserId(userId: string): Promise<CartDocument | null> {
        return CartModel.findById(userId).exec();
    }

    async getRecipeById(recipeId: string): Promise<RecipeDocument | null> {
        return RecipeModel.findById(recipeId).exec();
    }

    async deleteById(cartId: string): Promise<boolean> {
        const res = await CartModel.deleteOne({_id: cartId}).exec();
        return res.deletedCount === 1;
    }

    async addItem(userId: string, recipeId: string, number: number): Promise<CartDocument | null> {
        const cart = await this.getCartByUserId(userId);
        if(!cart) {
            return null;
        }
        const tmp = await this.getRecipeById(recipeId)
        if(tmp !== undefined) {
            cart.content.push(recipeId, number);
        }
        const res = await cart.save();
        return res;
    }
}
