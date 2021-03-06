import {CoffeeDocument, CoffeeModel, CoffeeProps} from "../models/coffee.model";
import {InterventionDocument, InterventionModel} from "../models/intervention.model";
import {Schema} from "mongoose";
import {UserModel, UserProps} from "../models";
import {UserDocument, UserModel} from "../models";
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

    async getAllFreePreparatorAtDate(date: Date, afterDate: Date): Promise<UserProps[]> {
        let tmp =  await InterventionModel.find().exec();
        let idPreparator: string[] = [];
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].datePlanned < afterDate && tmp[i].datePlanned >= date){
                if(!idPreparator.includes(tmp[i].idPreparator.toString())){
                    idPreparator.push(tmp[i].idPreparator.toString());
                }
            }
        }
        let preparatorsfree: UserProps[] = [];
        for(let i = 0; i < idPreparator.length; i++){
            const tmp = UserModel.findById(idPreparator[i]).exec();
            console.log('tmp : ', tmp);
            const prepa = new UserModel(tmp);
            console.log("prepa", prepa);
            preparatorsfree.push(prepa);
        }
        return preparatorsfree;
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
    async getPreparator(): Promise<UserDocument[] | null> {
        return UserModel.find({
            role : "Preparator"
        }).exec();
    }


}
