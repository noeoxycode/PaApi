import mongoose, {Schema, Document, Model} from "mongoose";
import {CartProps} from "./cart.model";
import {UserProps} from "./user.model";
import {RecipeProps} from "./recipe.models";

const interventionSchema = new Schema({
    idRecipe: [{
        type: Schema.Types.ObjectId,
        required: true
    }],
    quantity: [{
        type: Schema.Types.Number,
        required: true
    }],
    datePlanned: {
        type: Schema.Types.Date,
        required: true,
    },
    idPreparator: {
        type: Schema.Types.ObjectId,
    },
    idCustomer: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    collection: "intervention",
    timestamps: true,
    versionKey: false
});

export interface InterventionProps {
    idRecipe: RecipeProps[];
    quantity: number[];
    datePlanned: Date;
    idPreparator: string | UserProps;
    idCustomer: string | UserProps;
}

export type InterventionDocument = InterventionProps & Document;

export const InterventionModel: Model<InterventionDocument> = mongoose.model<InterventionDocument>("Intervention", interventionSchema);