import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";
import {MessageProps} from "./message.model";

const conversationSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    deliverId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    createdDate: {
        type: Schema.Types.Date,
        required: true,
    },
    messages: {
        type: Schema.Types.ObjectId,
        required: false
    }
}, {
    collection: "conversations",
    timestamps: true,
    versionKey: false
});

export interface ConversationProps {
    customerId: string | UserProps;
    deliverId: string | UserProps;
    createdDate: Date;
    messages: string[];
}

export type ConversationDocument = ConversationProps & Document;

export const ConversationModel: Model<ConversationDocument> = mongoose.model<ConversationDocument>("Conversation", conversationSchema);