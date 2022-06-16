import mongoose, {Schema, Document, Model} from "mongoose";
import {IngredientModel, IngredientProps} from "./ingredient.model";

const menuSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    price: {
        type: Schema.Types.Number,
        required: true,
        min: 0
    },
    description: {
        type: Schema.Types.String,
        required: true
    },
    content: [{
        type: Schema.Types.ObjectId, //a confirmer
        required: true,
        ref: "Product"
    }],
}, {
    collection: "menu",
    timestamps: true,
    versionKey: false
});

export interface MenuProps {
    name: string;
    price: number;
    description: string;
    content: string[] | IngredientProps[];
}

export type MenuDocument = MenuProps & Document;

export const MenuModel: Model<MenuDocument> = mongoose.model<MenuDocument>("Menu", menuSchema);
