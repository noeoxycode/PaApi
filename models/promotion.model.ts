import mongoose, {Schema, Document, Model} from "mongoose";
import {ProductModel, ProductProps} from "./product.model";
import {MenuModel, MenuProps} from "./menu.model";

const promotionSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    price: {
        type: Schema.Types.Number,
        required: true
    },
    promotionType: {
        type: Schema.Types.String,
        required: true
    },
    beginDate: {
        type: Schema.Types.Date,
        required: true
    },
    endDate: {
        type: Schema.Types.Date,
        required: false
    },
    content: [{
        type: Schema.Types.ObjectId, //a confirmer
        required: false,
        ref: "Content"
    }],
}, {
    collection: "promotion",
    timestamps: true,
    versionKey: false
});

export interface PromotionProps {
    name: string;
    price: number;
    promotionType: string;
    beginDate: Date;
    endDate: Date;
    content: string[] | ProductProps[] | MenuProps[]; //a confirmer
    _id : string;
}

export type PromotionDocument = PromotionProps & Document;

export const PromotionModel: Model<PromotionDocument> = mongoose.model<PromotionDocument>("Promotion", promotionSchema);
