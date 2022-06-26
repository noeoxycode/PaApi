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
        if(!user.cart) {
            throw new Error('Missing cart');
        }
        if(!user.wishlist) {
            throw new Error('Missing wishlist');
        }
        if(!user.favorite) {
            throw new Error('Missing favorite');
        }
        if(!user.stock) {
            throw new Error('Missing stock');
        }
        if(!user.history) {
            throw new Error('Missing history');
        }
        if(!user.material) {
            throw new Error('Missing material');
        }
        if(!user.orderinProgress) {
            throw new Error('Missing orderinProgress');
        }
        if(!user.linkedProfiles) {
            throw new Error('Missing linkedProfiles');
        }
        if(!user.photo) {
            throw new Error('Missing photo');
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
                cart: {
                    content: [{
                        idRecipe: user.cart.content[0].idRecipe,
                        quantity: user.cart.content[0].quantity
                    }],
                    deliveryDate: user.cart.deliveryDate,
                    customerId: user.cart.customerId,
                    assistantId: user.cart.assistantId,
                    status: user.cart.status,
                    numberCart: user.cart.numberCart,
                },
                wishlist : [{
                    content: user.wishlist.content,
                    idCustomer: user.wishlist.idCustomer,
                }],
                favorite: user.favorite,
                stock: {
                    ingredient: user.stock[0].ingredient,
                    quantity: user.stock[0].quantity
                },
                history: user.history,
                material: user.material,
                orderinProgress: user.orderinProgress,
                linkedProfiles: user.linkedProfiles,
                photo: user.photo,

            });
        console.log("cart content idrecipe", model.cart.content[0].idRecipe);
        console.log("wishlist content 0", model.wishlist.content);
        console.log("stock quantity", model.stock[0].quantity);
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
