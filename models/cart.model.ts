import mongoose, {Schema, Document, Model} from "mongoose";
import {IngredientProps} from "./ingredient.model";
import {RecipeProps} from "./recipe.models";
import {UserProps} from "./user.model";
export const cartSchema = new Schema({
    idRecipe: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
      type: Schema.Types.Number,
      required: true
    },
    plannedMeal: {
        type: Schema.Types.Date,
        required: false
    }
}, {
    collection: "cart",
    timestamps: true,
    versionKey: false
});

export interface CartProps {
    idRecipe : string | RecipeProps;
    quantity : number;
    plannedMeal: Date | null;
}

export type CartDocument = CartProps & Document;

export const CartModel: Model<CartDocument> = mongoose.model<CartDocument>("Cart", cartSchema);
