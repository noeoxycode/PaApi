import {CoffeeDocument, CoffeeModel, CoffeeProps} from "../models/coffee.model";
import {InterventionDocument, InterventionModel} from "../models/intervention.model";
import {Schema} from "mongoose";
export class PreparatorService {
    private static instance?: PreparatorService;
    private izi: any;
    public static getInstance(): PreparatorService {
        if(PreparatorService.instance === undefined) {
            PreparatorService.instance = new PreparatorService();
        }
        return PreparatorService.instance;
    }
    private constructor() { }

    async getAll(): Promise<InterventionDocument[]> {
        return InterventionModel.find().exec();
    }

    async getAllInterventions(id: string): Promise<InterventionDocument[]> {
        return InterventionModel.find({
            idCustomer: id
        }).exec();
    }

    async getAllInterventionsAfter(id: string): Promise<InterventionDocument[]> {
        let tmp =  await InterventionModel.find({
            idCustomer: id
        }).exec();
        console.log("tmp : ", tmp);
        let interventions = [];
        var current = new Date();
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].datePlanned > current)
                interventions.push(tmp[i]);
        }
        console.log("interventions : ", interventions);
        return interventions;
    }

    async getAllInterventionsBefore(id: string): Promise<InterventionDocument[]> {
        let tmp =  await InterventionModel.find({
            idCustomer: id
        }).exec();
        let interventions = [];
        var current = new Date();
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].datePlanned < current)
                interventions.push(tmp[i]);
        }
        return interventions;
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
