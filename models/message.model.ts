import mongoose, {Schema, Document, Model} from "mongoose";

const messageSchema = new Schema({
    idExpediteur: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    content: {
        type: Schema.Types.String,
        required: true,
    },
    sentDate: {
        type: Schema.Types.Date,
        required: true
    },
    idConversation: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    collection: "messages",
    timestamps: true,
    versionKey: false
});

export interface MessageProps {
    idExpediteur: string;
    content: string;
    sentDate: Date;
    idConversation: string,
}

export type MessageDocument = MessageProps & Document;

export const MessageModel: Model<MessageDocument> = mongoose.model<MessageDocument>("Message", messageSchema);