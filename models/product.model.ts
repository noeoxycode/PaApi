import mongoose, {Schema, Document, Model} from "mongoose";

const productStat:{[status:string]:string}={
    "burger":'burger',
    "dessert": 'dessert',
    "accompagnement": "accompagnement",
    "drink": "boissons",
    "smallEat": "petite faim",
    "toShare": "a partager",
    "healty": "nouriture saine"
}

const productSchema = new Schema({
   name: {
       type: Schema.Types.String,
       required: true
   },
    price: {
        type: Schema.Types.Number,
        required: true,
        min: 0
    },
    type: [{
        type: Schema.Types.String,
        required: true
    }],
    description: {
        type: Schema.Types.String,
        required: true
    },
}, {
    collection: "product",
    timestamps: true,
    versionKey: false
});

export interface ProductProps {
    name: string;
    price: number;
    description: string;
    type:string;
}

export type ProductDocument = ProductProps & Document;

export const ProductModel: Model<ProductDocument> = mongoose.model<ProductDocument>("Product", productSchema);
