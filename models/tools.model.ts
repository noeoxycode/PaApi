import mongoose, {Schema, Document, Model} from "mongoose";

const toolSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    photo: {
        type: Schema.Types.String,
        required: true
    },
    description: {
        type: Schema.Types.String,
        required: true
    },
}, {
    collection: "tool",
    timestamps: true,
    versionKey: false
});

export interface ToolProps {
    name: string;
    photo:string;
    description:string;
}

export type ToolDocument = ToolProps & Document;

export const ToolModel: Model<ToolDocument> = mongoose.model<ToolDocument>("Tool", toolSchema);
