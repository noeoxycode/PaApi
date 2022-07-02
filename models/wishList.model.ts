import mongoose, {Schema, Document, Model, Types} from "mongoose";
import {RecipeProps} from "./recipe.models";
import {UserProps} from "./user.model";
import {wantedMealSchema} from "./wantedMeal.model";

export const wishListSchema = new Schema({
    content: [{
        type: wantedMealSchema,
        ref: "Recipe"
    }],
    idCustomer: {
        type: Schema.Types.ObjectId,
        required: true
    },
}, {
    collection: "wishList",
    timestamps: true,
    versionKey: false
});

export interface WishListProps {
    content: string[] | RecipeProps[];
    idCustomer: string |UserProps;
}

export type WishListDocument = WishListProps & Document;

export const WishListModel: Model<WishListDocument> = mongoose.model<WishListDocument>("WishList", wishListSchema);
