import mongoose, {Schema, Document, Model} from "mongoose";
import {IngredientModel, IngredientProps} from "./ingredient.model";
import {MenuModel, MenuProps} from "./menu.model";
import {PromotionModel, PromotionProps} from "./promotion.model";
import {UserProps, UserModel} from "./user.model";

const orderSchema = new Schema({
    price: {
        type: Schema.Types.Number,
        required: true
    },
    date: {
        type: Schema.Types.Date,
        required: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    preparatorId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    content: [{
        type: Schema.Types.ObjectId, //a confirmer
        required: false,
        ref: "Content"
    }],
    status: {
        type: Schema.Types.Number,
        required: true
    },
    idResto: {
        type: Schema.Types.ObjectId,
        required: true
    },
    adress: {
        type: Schema.Types.String,
        required: false
    },
    location: {
        type: Schema.Types.String,
        required: false
    }
}, {
    collection: "order",
    timestamps: true,
    versionKey: false
});

export interface OrderProps {
    price: number;
    status:string;
    customerId:string;
    preparatorId:string;
    date: Date;
    content: string[] | IngredientProps[] | MenuProps[] | PromotionProps[]; //a confirmer
    idResto: string;
    adress: string;
    location: string;
}

export type OrderDocument = OrderProps & Document;

export const OrderModel: Model<OrderDocument> = mongoose.model<OrderDocument>("Order", orderSchema);
