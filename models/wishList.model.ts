import mongoose, {Schema, Document, Model, Types} from "mongoose";
import {RecipeProps} from "./recipe.models";
import {UserProps} from "./user.model";

export const wishListSchema = new Schema({
    idRecipe: {
        type: Schema.Types.ObjectId,
        ref: "Recipe"
    },
    quantity: {
        type: Schema.Types.Number,
        required: true
    },
}, {
    collection: "wishList",
    timestamps: true,
    versionKey: false
});

export interface WishListProps {
    idRecipe: string | RecipeProps;
    quantity: number;
}

export type WishListDocument = WishListProps & Document;

export const WishListModel: Model<WishListDocument> = mongoose.model<WishListDocument>("WishList", wishListSchema);
