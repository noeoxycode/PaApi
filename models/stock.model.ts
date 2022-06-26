import mongoose, {Schema, Document, Model} from "mongoose";
import {IngredientProps} from "./ingredient.model";



export const stockSchema = new Schema({
    ingredient: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Schema.Types.Number,
        required: true
    },
}, {
    collection: "stock",
    timestamps: true,
    versionKey: false
});

export interface StockProps {
    ingredient: IngredientProps;
    quantity:number;
}

export type StockDocument = StockProps & Document;

export const StockModel: Model<StockDocument> = mongoose.model<StockDocument>("Stock", stockSchema);
