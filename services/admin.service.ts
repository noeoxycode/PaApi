import {possibleRole, UserDocument, UserModel, UserProps} from "../models";
import {SessionDocument, SessionModel} from "../models/session.model";
import {Session} from "inspector";
import {CartDocument, CartModel, cartSchema} from "../models/cart.model";
import {RecipeDocument, RecipeModel, RecipeProps} from "../models/recipe.models";
import {DemandeModel, DemandeProps} from "../models/demande.model";
import {AuthUtils} from "../utils"

export class AdminService {

    private static instance?: AdminService;

    public static getInstance(): AdminService {
        if(AdminService.instance === undefined) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }

    private constructor() { }

    public async getCurrDemande():Promise<{ id:string;user: UserDocument; message: string; status: string }[]> {
        let tes:{
            user:UserDocument,
            message:string,
            id:string,
            status:string
        }[]=[]
        let tmp=await DemandeModel.find({status: "Attente"}).exec();
        for (const element of tmp) {
            let tmp2 = await AuthUtils.getUserById(element.user.toString());
            if (tmp2 !== null) {
                tes.push({id:element._id,user:tmp2,message:element.message,status:element.status});
            }
        }
        return tes;
    }
    public async getDemandeByUser(id:string):Promise<{ id:string;user: UserDocument; message: string; status: string }[]> {
        let tes:{
            user:UserDocument,
            message:string,id:string;
            status:string
        }[]=[]
        let tmp=await DemandeModel.find({user: id}).exec();
        for (const element of tmp) {
            let tmp2 = await AuthUtils.getUserById(element.user.toString());
            if (tmp2 !== null) {
                tes.push({id:element._id,user:tmp2,message:element.message,status:element.status});
            }
        }
        return tes;
    }
    public async getDemandeById(id:string):Promise<{  id:string;message: string; status: string;user: UserDocument}|null>{
        let tes:{
            user:UserDocument,
            message:string,
            id:string;
            status:string
        }
        let tmp=await  DemandeModel.findOne({_id: id}).exec();
        if(!tmp){
            return null;
        }
        let tmp2 = await AuthUtils.getUserById(tmp.user.toString());
        if(!tmp2){
            return null;
        }
        tes={id:tmp._id,user:tmp2,message:tmp.message,status:tmp.status}
        return tes;
    }
    public async updateDemande(id:string,state:string){
        if(state!=="Accepter"&&state!=="Refuser"){
            throw "Erreur de requete"
        }
       let demande=await DemandeModel.findOne({id:id}).exec()
        if(!demande) {
            throw "Demande introuvable"
        }
        if(demande.status!=="Attente") {
            throw "Erreur du status de la demande"
        }
        let newDemande = new DemandeModel(demande);
        newDemande.status = state;

        if(state==="Accepter"){
            let user=await UserModel.findOne({_id: newDemande.user}).exec()
            if(!user) {
                throw "User introuvable"
            }
            let newUser = new UserModel(user);
            newUser.role = "Preparator";
            const updateduser = await newUser.save();
        }
        const updatedDemande = await newDemande.save();


        return updatedDemande;
    }



}
