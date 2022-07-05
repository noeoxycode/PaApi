import {CartDocument, CartModel, CartProps} from "../models/cart.model";
import {RecipeDocument, RecipeModel, RecipeProps} from "../models/recipe.models";
import {Schema} from "mongoose";
import {UserDocument, UserModel, UserProps} from "../models";
import {RestoDocument, RestoModel} from "../models/restau.model";
import {ToolDocument, ToolModel, ToolProps} from "../models/tools.model";
import {CoffeeDocument, CoffeeModel, CoffeeProps} from "../models/coffee.model";
import {WishListModel, WishListProps} from "../models/wishList.model";
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

    public async createTool(props: ToolProps): Promise<ToolDocument> {
        const model = new ToolModel(props);
        const tool = await model.save();
        return tool;
    }

    async getAll(): Promise<CartDocument[]> {
        return CartModel.find().exec();
    }

    async getAllRecipe(): Promise<RecipeDocument[]> {
        return RecipeModel.find().exec();
    }

    async getRecipeById(recipeId: string): Promise<RecipeDocument | null> {
        return RecipeModel.findById(recipeId).exec();
    }
    async getToolById(toolId: string): Promise<ToolDocument | null> {
        return ToolModel.findById(toolId).exec();
    }

    async getUserById(userId: string): Promise<UserDocument | null> {
        return await UserModel.findById(userId).exec();
    }

    async deleteById(cartId: string): Promise<boolean> {
        const res = await CartModel.deleteOne({_id: cartId}).exec();
        return res.deletedCount === 1;
    }

    async asignToolToUser(toolId: string, user: UserProps | null): Promise<UserDocument> {
        const newUSer = new UserModel(user);
        if(this.getToolById(toolId) != null)
            { // @ts-ignore
                newUSer.material.push(toolId);
            }
        const updatedUSer = await newUSer.save();
        return updatedUSer;
    }

    async addRecipeToCart(item: CartProps, user: UserProps | null): Promise<UserDocument> {
        const newUSer = new UserModel(user);
        if(item.idRecipe && await this.getRecipeById(item.idRecipe.toString()) != null)
            {
                const newItem = new CartModel({
                    idRecipe: item.idRecipe,
                    quantity: item.quantity,
                    numberCart: item.numberCart
                })
                const createdItem = await newItem.save();
                newUSer.cart.push(createdItem.id);
            }
        const updatedUSer = await newUSer.save();
        return updatedUSer;
    }

    async addRecipeToWishlist(item: WishListProps, user: UserProps | null): Promise<UserDocument> {
        console.log("coucou in service");
        const newUSer = new UserModel(user);
        if(item.idRecipe && await this.getRecipeById(item.idRecipe.toString()) != null)
            {
                console.log("coucou in if");
                const newItem = new WishListModel({
                    idRecipe: item.idRecipe,
                    quantity: item.quantity,
                })
                const createdItem = await newItem.save();
                newUSer.wishlist.push(createdItem.id);
            }
        const updatedUSer = await newUSer.save();
        return updatedUSer;
    }

    async removeRecipeFromCart(itemId: string, user: UserProps | null) {
        const tmpUser = new UserModel(user);
        if(tmpUser){
            for(let i = 0; i < tmpUser.cart.length; i++){
                if(tmpUser.cart[i] == itemId){
                    tmpUser.cart.splice(i);
                    break;
                }
            }
            const updatedUser = await tmpUser.save();
            return updatedUser;
        }
    }

    async removeRecipeFromWishlist(itemId: string, user: UserProps | null) {
        const tmpUser = new UserModel(user);
        if(tmpUser){
            for(let i = 0; i < tmpUser.cart.length; i++){
                if(tmpUser.wishlist[i] == itemId){
                    tmpUser.wishlist.splice(i);
                    break;
                }
            }
            const updatedUser = await tmpUser.save();
            return updatedUser;
        }
    }


    async deleteTool(toolId: string) {
        const toolToDelete = await ToolModel.findById(toolId);
        if(!toolToDelete)
            return;
        const usersUsingTool = await UserModel.find({material: toolId}).exec();
        const res = await ToolModel.deleteOne({_id: toolId}).exec();
        for (let i = 0; i < usersUsingTool.length; i++)
        {
            for(let j=0; j< usersUsingTool[i].material.length; j++){
                if(usersUsingTool[i].material[j]== toolToDelete.id){
                    usersUsingTool[i].material.splice(j);
                    usersUsingTool[i].save();
                    break;
                }
            }
        }
        return 1;
    }
}
