import mongoose, {Schema, Document, Model} from "mongoose";
import {IngredientModel, IngredientProps} from "./ingredient.model";
import {MenuModel, MenuProps} from "./menu.model";
import {PromotionModel, PromotionProps} from "./promotion.model";
import {UserProps, UserModel} from "./user.model";
import {InterventionProps} from "./intervention.model";

const orderSchema = new Schema({
    price: {
        type: Schema.Types.Number,
    },
    customerId: {
        type: Schema.Types.ObjectId,
    },
    intervention: [{
        type: Schema.Types.ObjectId, //a confirmer
        ref: "Content"
    }],
    status: {
        type: Schema.Types.String,
    },
}, {
    collection: "order",
    timestamps: true,
    versionKey: false
});

export interface OrderProps {
    price: number;
    status:string;
    customerId:string;
    intervention: InterventionProps[] ;
}

export type OrderDocument = OrderProps & Document;

export const OrderModel: Model<OrderDocument> = mongoose.model<OrderDocument>("Order", orderSchema);
