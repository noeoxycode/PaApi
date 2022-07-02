import mongoose, {Schema, Document, Model} from "mongoose";
import {SessionProps} from "./session.model";
import {RestoProps} from "./restau.model";
import {adressSchema, AdressProps} from "./adress.model";
import {RecipeProps} from "./recipe.models";
import {IngredientProps} from "./ingredient.model";
import {OrderProps} from "./order.model";
import {ToolProps} from "./tools.model";
import {CartDocument, CartProps, cartSchema} from "./cart.model";
import {WishListProps, wishListSchema} from "./wishList.model";
import {StockProps, stockSchema} from "./stock.model";

export const possibleRole:{[status:string]:string;}={
    "BigBoss":'BigBoss',
    "Admin": 'Admin',
    "Customer": 'Customer',
    "Assistant": 'Assistant'
}
export enum Role {
    BigBoss,
    Admin,
    Customer,
    Assistant
}

const userSchema = new Schema({
    login: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type:Schema.Types.String,
        required: false
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    surname: {
        type: Schema.Types.String,
        required: false
    },
    birthdate: {
        type: Schema.Types.Date,
        required: false
    },
    adress: {
        type: adressSchema,
        required: false
    },
    email: {
        type: Schema.Types.String,
        required: false
    },
    sessions: [{
        type: Schema.Types.ObjectId,
        ref: "Session"
    }],
    cart: [{
        type: Schema.Types.ObjectId,
        ref: "Cart"
    }],
    wishlist: [{
        type: wishListSchema,
        ref: "Wishlist"
    }],
    favorite: [{
        type: Schema.Types.ObjectId,
        ref: "Favorite"
    }],
    stock: [{
        type: stockSchema,
        ref: "stock"
    }],
    history: [{
        type: Schema.Types.ObjectId,
        ref: "Order"
    }],
    material: [{
        type: Schema.Types.ObjectId,
        ref: "Tools"
    }],
    orderInProgress: [{
        type: Schema.Types.ObjectId,
        ref: "OrderInProgress"
    }],
    linkedProfiles: [{
        type: Schema.Types.ObjectId,
        ref: "Linked profile"
    }],
    photo: [{
        type: Schema.Types.String,
        ref: "Profile photo"
    }],
    }, {
    collection: "users",
    timestamps: true,
    versionKey: false
});

export interface UserProps {
    login: string;
    password: string;
    role: string;
    name: string;
    surname: string;
    birthdate: Date;
    adress: AdressProps;
    email: string;
    sessions: string[] | SessionProps[];
    cart: string[] | CartProps[];
    wishlist: WishListProps;
    favorite: string[] | RecipeProps[];
    stock: StockProps[];
    history: OrderProps[];
    material: string[] | ToolProps[];
    orderinProgress: [OrderProps];
    linkedProfiles: [string | UserProps];
    photo: string;
}

export type UserDocument = UserProps & Document;
export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
