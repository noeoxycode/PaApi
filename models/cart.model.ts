import mongoose, {Schema, Document, Model} from "mongoose";
import {IngredientProps} from "./ingredient.model";
import {RecipeProps} from "./recipe.models";
import {UserProps} from "./user.model";

const cartSchema = new Schema({
    content: [{
        type: Schema.Types.ObjectId,
        ref: "Recipe"
    },
    {
        type: Schema.Types.Number,
        ref: "Quantity"
    }]
    ,
    deliveryDate: {
        type: Schema.Types.Date,
        required: false
    },
    customerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    assistantId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    status: {
        type: Schema.Types.String,
        required: true
    },
    numberCart: {
        type: Schema.Types.Number,
        required: true
    },
}, {
    collection: "cart",
    timestamps: true,
    versionKey: false
});

export interface CartProps {
    content: [string | RecipeProps, number];
    deliveryDate:Date;
    customerId:string|UserProps;
    assistantId:string|UserProps;
    status:string;
    numberCart:number;
}

export type CartDocument = CartProps & Document;

export const CartModel: Model<CartDocument> = mongoose.model<CartDocument>("Cart", cartSchema);
