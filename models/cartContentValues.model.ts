import mongoose, {Schema, Document, Model} from "mongoose";
import {IngredientProps} from "./ingredient.model";
import {RecipeProps} from "./recipe.models";
import {UserProps} from "./user.model";

export const cartContentValuesSchema = new Schema({
    idRecipe: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Schema.Types.Number,
        required: true
    },
}, {
    collection: "cartValues",
    timestamps: true,
    versionKey: false
});

export interface CartContentValuesProps {
    idRecipe : string | RecipeProps;
    quantity : number;
}

export type CartContentValuesDocument = CartContentValuesProps & Document;

export const CartContentValuesModel: Model<CartContentValuesDocument> = mongoose.model<CartContentValuesDocument>("CartContentValues", cartContentValuesSchema);
