import {possibleRole, UserDocument, UserModel, UserProps} from "../models";
import {AuthUtils, SecurityUtils} from "../utils";
import {SessionDocument, SessionModel} from "../models/session.model";
import {Session} from "inspector";

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
        if(!user.password) {
            throw new Error('Missing password');
        }
        if(!user.password) {
            throw new Error('Missing password');
        }
        if(!user.password) {
            throw new Error('Missing password');
        }
        if(!user.password) {
            throw new Error('Missing password');
        }
        if(!user.password) {
            throw new Error('Missing password');
        }
        let roleName="";
        if(await AuthUtils.checkBigBoss()){
            roleName = possibleRole["BigBoss"];
        }else{
            roleName = possibleRole["Customer"];
        }
            const model = new UserModel({
                login: user.login,
                password: SecurityUtils.sha512(user.password),
                role:roleName,
                name: user.name,
                surname: user.surname,
                birthDate: user.birthDate,


                adress: {
                    number: user.adress.number,
                    street: req.body.street,
                    postalCode: req.body.postalCode,
                    town: req.body.town,
                    country: req.body.country,
                },
                email: req.body.email,
                cart: {
                    content: req.body.content,
                    deliveryDate: req.body.deliverDate,
                    customerId: req.body.customerId,
                    assistantId: req.body.assistantId,
                    status: req.body.status,
                    numberCart: req.body.numberCart,
                },

            });
            return model.save();
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
