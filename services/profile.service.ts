import {CartDocument, CartModel, CartProps} from "../models/cart.model";
import {RecipeDocument, RecipeModel, RecipeProps} from "../models/recipe.models";
import {Schema} from "mongoose";
import {UserDocument, UserModel, UserProps} from "../models";
import {RestoDocument, RestoModel} from "../models/restau.model";
import {ToolDocument, ToolModel, ToolProps} from "../models/tools.model";
import {CoffeeDocument, CoffeeModel, CoffeeProps} from "../models/coffee.model";
export class ProfileService {
    private static instance?: ProfileService;
    public static getInstance(): ProfileService {
        if(ProfileService.instance === undefined) {
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance;
    }
    private constructor() { }

    async updateUser(user: UserDocument | null, props: UserProps): Promise<UserDocument | null> {
        console.log("begin of update user");
        const newUSer = new UserModel(user);
        if(!newUSer) {
            return null;
        }
        if(props.name !== undefined) {
            newUSer.name = props.name;
        }
        if(props.surname !== undefined) {
            newUSer.surname = props.surname;
        }
        if(props.birthdate !== undefined) {
            newUSer.birthdate = props.birthdate;
        }
        if(props.adress !== undefined) {
            newUSer.adress = props.adress;
        }
        if(props.email !== undefined) {
            newUSer.email = props.email;
        }
        const updatedUSer = await newUSer.save();
        return updatedUSer;
    }
}
