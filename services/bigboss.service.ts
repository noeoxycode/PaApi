import {possibleRole, Role, UserDocument, UserModel, UserProps} from "../models";
import {AuthUtils, SecurityUtils} from "../utils";
import {SessionDocument, SessionModel} from "../models/session.model";
import {Session} from "inspector";
import {RestoDocument, RestoModel, RestoProps} from "../models/restau.model";
import {CoffeeDocument, CoffeeModel, CoffeeProps} from "../models/coffee.model";

export class BigBossService {

    private static instance?: BigBossService;

    public static getInstance(): BigBossService {
        if(BigBossService.instance === undefined) {
            BigBossService.instance = new BigBossService();
        }
        return BigBossService.instance;
    }

    private constructor() { }

    public async createResto(props: RestoProps): Promise<RestoDocument> {
        const model = new RestoModel(props);
        const resto = await model.save();
        return resto;
    }

    public async createEmployee(user:Partial<UserProps>):Promise<UserDocument>{
        if(!user.password) {
            throw new Error('Missing password');
        }
        if(!user.role) {
            throw new Error('Missing role');
        }
        if(!(user.role in Role) || user.role==="BigBoss"){
            throw new Error('Bad role');
        }
        const model = new UserModel({
            login: user.login,
            password: SecurityUtils.sha512(user.password),
            role:user.role

        });
        return model.save();
    }

    async deleteRestoById(restoId: string): Promise<boolean> {
        const res = await RestoModel.deleteOne({_id: restoId}).exec();
        return res.deletedCount === 1;
    }
    async deleteAdminById(adminId: string): Promise<boolean> {
        const res = await UserModel.deleteOne({$and:[{_id:adminId},{ role :"Admin"}]}).exec();
        return res.deletedCount === 1;
    }

    async getuserByIdAndRole(userId: string,role:string=""): Promise<UserDocument | null> {
        const user = await UserModel.findById(userId).exec();
        if(!user){
            return null;
        }
        if(role===""){
            return user
        }else {
            if (user.role === role) {
                return user;
            } else {
                return null;
            }
        }

    }
    async getRestoById(restoId: string): Promise<RestoDocument | null> {
        return RestoModel.findById(restoId).exec();
    }

    async getAllResto(): Promise<RestoDocument[]> {
        return RestoModel.find().exec();
    }

    async affectRestoToAdmin(restoId: string,adminId: string): Promise<UserDocument | null> {
        const resto = await this.getRestoById(restoId);
        const admin = await this.getuserByIdAndRole(adminId,"Admin");
        if(!admin || !resto) {
            return null;
        }
        if(resto._id!==undefined){
            admin.restaurant=resto._id;
        }
        const res = await admin.save();
        return res;

    }

    async swapBoss(pastBoss: UserProps,newBoss: string){
        const newB = await this.getuserByIdAndRole(newBoss,"Admin");
        if (!pastBoss || !newB) {
            return null;
        }
        const past= await UserModel.find({
            role: "BigBoss"
        }).exec();
        if( past.length!==1){
            return null;
        }
        newB.role=possibleRole["BigBoss"]
        past[0].role=possibleRole["Admin"]
        const res1 = await newB.save();
        const res2 = await past[0].save();
        return {res1,res2};
    }

    async updateAdminById(adminId: string, props: Partial<UserProps>): Promise<UserDocument | null> {
        const admin = await this.getuserByIdAndRole(adminId,"Admin");
        if (!admin) {
            return null;
        }
        if(props.login !== undefined) {
            admin.login = props.login;
        }
        if(props.password !== undefined) {
            admin.password = SecurityUtils.sha512(props.password);
        }
        if(props.restaurant !== undefined) {
            admin.restaurant = props.restaurant;
        }
        if(props.role !== undefined && props.role in Role) {
            admin.role = props.role;
        }
        const res = await admin.save();
        return res;

    }
    async getAllAdmin(): Promise<UserDocument[]> {
        return UserModel.find({role: "Admin"}).exec();
    }
    async updateById(restoId: string, props: RestoProps): Promise<RestoDocument | null> {
        const resto = await this.getRestoById(restoId);
        if(!resto) {
            return null;
        }
        if(props.name !== undefined) {
            resto.name = props.name;
        }
        if(props.adress !== undefined) {
            resto.adress = props.adress;
        }
        if(props.menu !== undefined) {
            resto.menu = props.menu;
        }
        if(props.promotion !== undefined) {
            resto.promotion = props.promotion;
        }
        if(props.product !== undefined) {
            resto.product = props.product;
        }
        if(props.admin !== undefined) {
            resto.admin = props.admin;
        }
        const res = await resto.save();
        return res;
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
