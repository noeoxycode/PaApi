import mongoose, {Schema, Document, Model, Types} from "mongoose";
import {RecipeProps} from "./recipe.models";
import {UserProps} from "./user.model";

const wishListSchema = new Schema({
    content: [[{
            type: Schema.Types.ObjectId,
            ref: "Recipe"
        }],
            [{type: Schema.Types.Date,
            ref: "AddDate"}]
    ],
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
    content: [string[] | RecipeProps[], Date[]];
    idCustomer: string |UserProps;
}

export type WishListDocument = WishListProps & Document;

export const WishListModel: Model<WishListDocument> = mongoose.model<WishListDocument>("WishList", wishListSchema);
