import mongoose, {Schema, Document, Model} from "mongoose";
import {ProductModel, ProductProps} from "./product.model";

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
    content: string[] | ProductProps[];
    _id : string;
}

export type MenuDocument = MenuProps & Document;

export const MenuModel: Model<MenuDocument> = mongoose.model<MenuDocument>("Menu", menuSchema);
