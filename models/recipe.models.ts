import mongoose, {Schema, Document, Model} from "mongoose";
import {IngredientProps} from "./ingredient.model"
import {ToolProps} from "./tools.model";


const recipeSchema = new Schema({
    tittle: {
        type: Schema.Types.String,
        required: true
    },
    description: {
        type: Schema.Types.String,
        required: true
    },
    price: {
        type: Schema.Types.Number,
        required: true,
        min: 0
    },
    ingredient: [{
        type: Schema.Types.ObjectId,
        required: true,
        min: 0
    }],
    timeToPrepare: {
        type: Schema.Types.Number,
        required: true,
        min: 0
    },
    instruction: {
        type: Schema.Types.String,
        required: true,
        min: 0
    },
    photo: {
        type: Schema.Types.String,
        required: true,
        min: 0
    },
    requirerTool: [{
        type: Schema.Types.ObjectId,
        required: false,
    }],
    type: [{
        type: Schema.Types.String,
        required: true
    }],

}, {
    collection: "recipe",
    timestamps: true,
    versionKey: false
});

export interface RecipeProps {
    tittle: string;
    description: string;
    price: number;
    timeToPrepare: number;
    ingredient: string[]|IngredientProps[];
    instruction: number;
    photo:string;
    requirerTool:string[]|ToolProps[];
    type:string[];
}

export type RecipeDocument = RecipeProps & Document;

export const RecipeModel: Model<RecipeDocument> = mongoose.model<RecipeDocument>("Recipe", recipeSchema);
