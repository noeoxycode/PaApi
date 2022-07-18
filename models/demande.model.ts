import mongoose, {Schema, Document, Model} from "mongoose";
import {UserDocument, UserModel, UserProps,userSchema} from "./user.model";



const demandeSchema = new Schema({
    user: {
        type: Schema.Types.String,
        required: true
    },
    message: {
        type: Schema.Types.String,
        required: true
    },
    status: {
        type: Schema.Types.String,
        required: true,
        min: 0
    },
}, {
    collection: "demande",
    timestamps: true,
    versionKey: false
});

export interface DemandeProps {
    user: string;
    message: string;
    status: string;
}

export type DemandeDocument = DemandeProps & Document;

export const DemandeModel: Model<DemandeDocument> = mongoose.model<DemandeDocument>("Demande", demandeSchema);
