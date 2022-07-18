import {possibleRole, UserDocument, UserModel, UserProps} from "../models";
import {AuthUtils, SecurityUtils} from "../utils";
import {SessionDocument, SessionModel} from "../models/session.model";
import {Session} from "inspector";
import {CartModel, cartSchema} from "../models/cart.model";
import {RecipeModel, RecipeProps} from "../models/recipe.models";
import {DemandeModel, DemandeProps} from "../models/demande.model";

export class AuthService {

    private static instance?: AuthService;

    public static getInstance(): AuthService {
        if(AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private constructor() { }


    public async subscribeUser(user: Partial<UserProps>): Promise<UserDocument> {
        if(!user.password) {
            throw new Error('Missing password');
        }
        if(!user.name) {
            throw new Error('Missing name');
        }
        if(!user.surname) {
            throw new Error('Missing surname');
        }
        if(!user.birthdate) {
            throw new Error('Missing birthdate');
        }
        if(!user.adress) {
            throw new Error('Missing adress');
        }
        if(!user.email) {
            throw new Error('Missing email');
        }
        if(!user.photo) {
            throw new Error('Missing photo');
        }
        let roleName="";
        if(await AuthUtils.checkBigBoss()) {
            roleName = possibleRole["BigBoss"];
        }else{
            roleName = possibleRole["Customer"];
        }
        const model = new UserModel({
            login: user.login,
            password: SecurityUtils.sha512(user.password),
            role: roleName,

            name: user.name,
            surname: user.surname,
            birthdate: user.birthdate,
            adress: {
                number: user.adress.number,
                street: user.adress.street,
                postalCode: user.adress.postalCode,
                town: user.adress.town,
                country: user.adress.country,
            },
            email: user.email,
            photo: user.photo,
        });
        let verif=await this.checkDuplicate(model.name,model.surname,model.email);
        if (verif){
            return model.save();
        }else{
            throw "Already exist";
        }
    }

    async checkDuplicate(name:string,surname:string,email:string){
        let tmp=await RecipeModel.find({name: name,surname:surname,email:email}).count().exec();
        console.log("compteur :",tmp)
        if (tmp===0){
            return false;
        }else{
            return true;
        }
    }

    public async createDemande(props: DemandeProps){
        const model = new DemandeModel(props);
        const demande = await model.save();
        return demande;
    }

    // Pick selectionne des champs dans le type
    public async logIn(info: Pick<UserProps, 'login' | 'password'>, platform: string): Promise<SessionDocument | null> {
        const user = await UserModel.findOne({
            login: info.login,
            password: SecurityUtils.sha512(info.password)
        }).exec();
        if(user === null) {
            throw new Error('User not found');
        }
        // 604_800 -> 1 week in seconds
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + 604_800_000);
        const session = await SessionModel.create({
            platform,
            expiration: expirationDate,
            user: user._id
        });
        user.sessions.push(session._id); // permet de memoriser la session dans le user
        await user.save();
        return session;
    }

    public async getUserFrom(token: string): Promise<UserProps | null> {
        const session = await SessionModel.findOne({
           _id: token,
           expiration: {
               $gte: new Date()
           }
        }).populate("user").exec();
        return session ? session.user as UserProps : null;
    }
}
