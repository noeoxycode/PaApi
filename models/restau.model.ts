import mongoose, {Schema, Document, Model} from "mongoose";
import {ProductModel, ProductProps} from "./product.model";
import {MenuModel, MenuProps} from "./menu.model";
import {PromotionModel, PromotionProps} from "./promotion.model";
import {UserProps, UserModel} from "./user.model";

const restoSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    adress: {
        type: Schema.Types.String,
        required: true
    },
    menu: [{
        type: Schema.Types.ObjectId,
        required: false
    }],
    promotion:  [{
        type: Schema.Types.ObjectId,
        required: false
    }],
    product: [{
        type: Schema.Types.ObjectId,
        required: false
    }],
    admin: {
        type: Schema.Types.ObjectId,
        required: false
    }
}, {
    collection: "resto",
    timestamps: true,
    versionKey: false
});

export interface RestoProps {
    name: string;
    adress: string;
    menu: string[] | MenuProps[];
    promotion: string[] | PromotionProps[];
    product: string[] | ProductProps[];
    admin: string | UserProps;
}

export type RestoDocument = RestoProps & Document;

export const RestoModel: Model<RestoDocument> = mongoose.model<RestoDocument>("Resto", restoSchema);
