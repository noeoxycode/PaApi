import {CoffeeDocument, CoffeeModel, CoffeeProps} from "../models";
export class CoffeeService {
    private static instance?: CoffeeService;
    public static getInstance(): CoffeeService {
        if(CoffeeService.instance === undefined) {
            CoffeeService.instance = new CoffeeService();
        }
        return CoffeeService.instance;
    }
    private constructor() { }

    public async createCoffee(props: CoffeeProps): Promise<CoffeeDocument> {
        const model = new CoffeeModel(props);
        const coffee = await model.save();
        return coffee;
    }

    async getAll(): Promise<CoffeeDocument[]> {
        return CoffeeModel.find().exec();
    }

    async getById(coffeeId: string): Promise<CoffeeDocument | null> {
        return CoffeeModel.findById(coffeeId).exec();
    }

    async deleteById(coffeeId: string): Promise<boolean> {
        const res = await CoffeeModel.deleteOne({_id: coffeeId}).exec();
        return res.deletedCount === 1;
    }

    async updateById(coffeeId: string, props: CoffeeProps): Promise<CoffeeDocument | null> {
        const coffee = await this.getById(coffeeId);
        if(!coffee) {
            return null;
        }
        if(props.name !== undefined) {
            coffee.name = props.name;
        }
        if(props.price !== undefined) {
            coffee.price = props.price;
        }
        if(props.origin !== undefined) {
            coffee.origin = props.origin;
        }
        if(props.intensity !== undefined) {
            coffee.intensity = props.intensity;
        }
        const res = await coffee.save();
        return res;
    }
}
