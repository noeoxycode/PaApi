import {CartDocument, CartModel, CartProps} from "../models/cart.model";
import {RecipeDocument, RecipeModel, RecipeProps} from "../models/recipe.models";
import {Schema} from "mongoose";
import {UserDocument, UserModel, UserProps} from "../models";
import {RestoDocument, RestoModel} from "../models/restau.model";
import {ToolDocument, ToolModel, ToolProps} from "../models/tools.model";
import {CoffeeDocument, CoffeeModel, CoffeeProps} from "../models/coffee.model";
import {WishListDocument, WishListModel, WishListProps} from "../models/wishList.model";
import {InterventionModel, InterventionProps} from "../models/intervention.model";
import {OrderModel, OrderProps} from "../models/order.model";
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
    async getAllCartContent(cart: string[] | CartProps[]): Promise<{ id: string; quantity: number; plannedMeal: Date|null; recipe: RecipeDocument; }[]> {
        console.log("test a");
       let content:CartDocument[]=[];
       let tes:{
           id:string,
           quantity:number,
           plannedMeal:Date|null,
           recipe:RecipeDocument
       }[]=[]
        console.log("test b");
        for (const element of cart) {
                let tmp = await this.getCartById(element.toString());
                if (tmp !== null) {
                    content.push(tmp);
            }
        }
        console.log("test c");
        let cpt=0;
        for (const element of content) {
            let tmp
            tmp=await this.getRecipeById(element.idRecipe.toString());
            if(tmp!==null) {
                console.log(content[cpt]);
                tes.push({id:content[cpt].id, quantity:content[cpt].quantity, plannedMeal:content[cpt].plannedMeal, recipe:tmp})
                console.log(content[cpt]);

            }
                cpt++;
        }
        console.log("test d",tes);
        return tes;
    }


    async getAllRecipeContent(list: string[] | RecipeProps[]): Promise<RecipeDocument[]> {
        console.log("test a");
       let content:RecipeDocument[]=[];

        console.log("test b");
        for (const element of list) {
                let tmp = await this.getRecipeById(element.toString());
                if (tmp !== null) {
                    content.push(tmp);
            }
        }

        console.log("test d",content);
        return content;
    }
    async getAllTool(): Promise<ToolDocument[]> {
        return ToolModel.find().exec();
    }

    async getRecipeById(recipeId: string | RecipeProps): Promise<RecipeDocument | null> {
        return RecipeModel.findById(recipeId).exec();
    }
    async getWishById(wishId: string | WishListProps): Promise<WishListDocument | null> {
        return WishListModel.findById(wishId).exec();
    }
    async getToolById(toolId: string): Promise<ToolDocument | null> {
        return ToolModel.findById(toolId).exec();
    }

    async getCartById(cartId: string | CartProps): Promise<CartDocument | null> {
        return CartModel.findById(cartId).exec();
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

    async addNewRecipeToCart(item: CartProps, user: UserProps | null): Promise<UserDocument> {
        const newUSer = new UserModel(user);
        if(item.idRecipe && await this.getRecipeById(item.idRecipe.toString()) != null)
            {
                const newItem = new CartModel({
                    idRecipe: item.idRecipe,
                    quantity: item.quantity,
                })
                const createdItem = await newItem.save();
                newUSer.cart.push(createdItem.id);
            }
        const updatedUSer = await newUSer.save();
        return updatedUSer;
    }

    async addRecipeToCart(item: CartProps, user: UserProps | null): Promise<CartDocument | UserDocument | undefined> {
        if (item.idRecipe && await this.getRecipeById(item.idRecipe.toString()) != null && user) {
            for (let i = 0; i < user.cart.length; i++) {
                const currentCartToCheck = await this.getCartById(user.cart[i].toString());
                if (currentCartToCheck && currentCartToCheck.id != null && currentCartToCheck.idRecipe == item.idRecipe) {
                    currentCartToCheck.quantity += item.quantity;
                    const res = await currentCartToCheck.save();
                    return res;
                }
            }
        }
        const res = this.addNewRecipeToCart(item, user);
        return res;
    }

    async updateCart(cart: CartDocument | null, props: CartDocument): Promise<CartDocument | null> {
        console.log("begin of update cart");
        const newCart = new CartModel(cart);
        if(!newCart) {
            return null;
        }
        if(props.quantity !== undefined) {
            newCart.quantity = props.quantity;
        }
        if(props.idRecipe !== undefined) {
            newCart.idRecipe = props.idRecipe;
        }
        const updatedCart = await newCart.save();
        return updatedCart;
    }

    async addRecipeToWishlist(toolId: string, user: UserProps | null): Promise<UserDocument> {
        const newUSer = new UserModel(user);
        const tmpRecipe = await this.getRecipeById(toolId);
        if(toolId && tmpRecipe != null && tmpRecipe.id != null)
        {
            newUSer.wishlist.push(tmpRecipe.id);
        }
        const updatedUSer = await newUSer.save();
        return updatedUSer;
    }

    async addRecipeToFavorite(recipelId: string, user: UserProps | null): Promise<UserDocument|null> {
        const newUSer = new UserModel(user);
        const tmpRecipe = await this.getRecipeById(recipelId);
        if (tmpRecipe===null){
            throw "Already exist";
        }
        if(!newUSer.favorite.includes(tmpRecipe.id)){
            if(recipelId && tmpRecipe.id != null)
            {
                newUSer.favorite.push(tmpRecipe.id);
            }
        }else{
            throw "Recipe error";
        }
        const updatedUSer = await newUSer.save();
        return updatedUSer;
    }

    async removeRecipeFromCart(itemId: string, user: UserProps | null) {
        const tmpUser = new UserModel(user);
        if(tmpUser){
            for(let i = 0; i < tmpUser.cart.length; i++){
                if(tmpUser.cart[i] == itemId){
                    tmpUser.cart.splice(i,1);
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
            for(let i = 0; i < tmpUser.wishlist.length; i++){
                if(tmpUser.wishlist[i] == itemId){
                    tmpUser.wishlist.splice(i,1);
                    break;
                }
            }
            const updatedUser = await tmpUser.save();
            return updatedUser;
        }
    }

    async removeRecipeFromFavorite(itemId: string, user: UserProps | null) {
        const tmpUser = new UserModel(user);
        if(tmpUser){
            for(let i = 0; i < tmpUser.favorite.length; i++){
                if(tmpUser.favorite[i].toString() === itemId){
                    tmpUser.favorite.splice(i,1);
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

    async getOrderPrice(interventions: InterventionProps[]){
        let price = 0;
        for(let i = 0; i < interventions.length; i++){
            for(let j = 0; j < interventions[i].idCart.length; j++){
                const tmpCart = await this.getCartById(interventions[i].idCart[j]);
                // @ts-ignore
                const tmpRecipe = await this.getRecipeById(tmpCart.idRecipe);
                // @ts-ignore
                price+=tmpRecipe.price;
            }

        }
        return price;
    }

    async  createOrder(interventions: InterventionProps[], user: UserProps | null){
        const newUser = new UserModel(user);
        let price = await this.getOrderPrice(interventions);
        const newOrder = new OrderModel({
            price: price,
            status: "En attente",
            customerId: newUser.id,
            intervention: []
        });
        for(let i =0; i < interventions.length; i++){
            const newIntervention = new InterventionModel({
                    idCart: interventions[i].idCart,
                    datePlanned: interventions[i].datePlanned,
                    idPreparator: interventions[i].idPreparator,
                    idCustomer: newUser.id
                },
            );
            const createIntervention = await  newIntervention.save();
            newOrder.intervention.push(createIntervention);
        }
        const createdOrder = await newOrder.save();
        newUser.orderInProgress.push(createdOrder.id);
        newUser.cart = [];
        const updatedUSer = await newUser.save();
        return updatedUSer;
    }
}
