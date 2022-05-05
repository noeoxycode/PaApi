import {possibleRole, UserDocument, UserModel, UserProps} from "../models";
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

    async deleteById(restoId: string): Promise<boolean> {
        const res = await RestoModel.deleteOne({_id: restoId}).exec();
        return res.deletedCount === 1;
    }

    async getById(restoId: string): Promise<RestoDocument | null> {
        return RestoModel.findById(restoId).exec();
    }

    async getAll(): Promise<RestoDocument[]> {
        return RestoModel.find().exec();
    }

    async updateById(restoId: string, props: RestoProps): Promise<RestoDocument | null> {
        console.log("test service update");
        const resto = await this.getById(restoId);
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
