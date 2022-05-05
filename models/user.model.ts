import mongoose, {Schema, Document, Model} from "mongoose";
import {SessionProps} from "./session.model";
import {RestoProps} from "./restau.model";

export const possibleRole:{[status:string]:string;}={
    "BigBoss":'BigBoss',
    "Admin": 'Admin',
    "Customer": 'Customer',
    "Preparator": 'Preparator',
    "Livreur": 'Livreur'
}

const userSchema = new Schema({
    login: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type:Schema.Types.String,
        required: true
    },
    restaurante: {
        type: Schema.Types.ObjectId,
        required: false
    },
    sessions: [{
        type: Schema.Types.ObjectId,
        ref: "Session"
    }]
}, {
    collection: "users",
    timestamps: true,
    versionKey: false
});

export interface UserProps {
    _id: string;
    login: string;
    restaurant: string | RestoProps;
    role: string;
    password: string;
    sessions: string[] | SessionProps[];
}

export type UserDocument = UserProps & Document;
export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
