import mongoose, {Schema, Document, Model, Types} from "mongoose";
import {RecipeProps} from "./recipe.models";
import {UserProps} from "./user.model";

export const wantedMealSchema = new Schema({
    recipe: {
        type: Schema.Types.ObjectId,
        ref: "Recipe"
    },
    quantity: {
        type: Schema.Types.Number,
        required: true
    },
}, {
    collection: "wantedMeal",
    timestamps: true,
    versionKey: false
});

export interface WantedMealProps {
    recipe: string | RecipeProps;
    quantity: string |UserProps;
}

export type WantedMealDocument = WantedMealProps & Document;

export const WantedMealModel: Model<WantedMealDocument> = mongoose.model<WantedMealDocument>("WantedMeal", wantedMealSchema);
