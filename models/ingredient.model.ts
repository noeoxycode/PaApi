import mongoose, {Schema, Document, Model} from "mongoose";

const ingredientStat:{[status:string]:string}={
    "burger":'burger',
    "dessert": 'dessert',
    "accompagnement": "accompagnement",
    "drink": "boissons",
    "smallEat": "petite faim",
    "toShare": "a partager",
    "healty": "nouriture saine"
}

const ingredientSchema = new Schema({
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
    collection: "ingredient",
    timestamps: true,
    versionKey: false
});

export interface IngredientProps {
    name: string;
    price: number;
    description: string;
    type:string;
}

export type IngredientDocument = IngredientProps & Document;

export const IngredientModel: Model<IngredientDocument> = mongoose.model<IngredientDocument>("Ingredient", ingredientSchema);
