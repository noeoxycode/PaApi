import mongoose, {Schema, Document, Model} from "mongoose";

export const adressSchema = new Schema({
    number: {
        type: Schema.Types.Number,
        required: true
    },
    street: {
        type: Schema.Types.String,
        required: true
    },
    postalCode: {
        type: Schema.Types.Number,
        required: true
    },
    town: {
        type: Schema.Types.String,
        required: true
    },
    country: {
        type: Schema.Types.String,
        required: true
    },
}, {
    collection: "adress",
    timestamps: true,
    versionKey: false
});

export interface AdressProps {
    number: number;
    street:string;
    postalCode:string;
    town:string;
    country:string;
}

export type AdressDocument = AdressProps & Document;

export const AdressModel: Model<AdressDocument> = mongoose.model<AdressDocument>("Adress", adressSchema);
