import {
    possibleRole,
    ProductDocument,
    ProductModel,
    ProductProps,
    Role,
    UserDocument,
    UserModel,
    UserProps
} from "../models";
import {AuthUtils, SecurityUtils} from "../utils";
import {SessionDocument, SessionModel} from "../models/session.model";
import {Session} from "inspector";
import {RestoDocument, RestoModel, RestoProps} from "../models/restau.model";
import {CoffeeDocument, CoffeeModel, CoffeeProps} from "../models/coffee.model";
import {MenuDocument, MenuModel, MenuProps} from "../models/menu.model";
import {PromotionDocument, PromotionModel, PromotionProps} from "../models/promotion.model";
import {OrderDocument, OrderModel, OrderProps} from "../models/order.model";

export class PreparatorService {

    private static instance?: PreparatorService;

    public static getInstance(): PreparatorService {
        if(PreparatorService.instance === undefined) {
            PreparatorService.instance = new PreparatorService();
        }
        return PreparatorService.instance;
    }

    private constructor() { }



    getOrderById(orderId: string): Promise<OrderDocument | null> {
        return OrderModel.findById(orderId).exec();
    }

    async getAllOrder(): Promise<OrderDocument[]> {
        return OrderModel.find().exec();
    }

    async updateOrderById(orderId: string, props: OrderProps): Promise<OrderDocument | null> {
        const order = await this.getOrderById(orderId);
        if(!order) {
            return null;
        }
        let price = await this.calculateOrderPrice(new OrderModel(props));
        order.price = price;
        if(props.status !== undefined) {
            order.status = props.status;
        }
        if(props.preparatorId !== undefined) {
            order.preparatorId = props.preparatorId;
        }
        if(props.preparatorId !== undefined) {
            order.preparatorId = props.preparatorId;
        }
        if(props.date !== undefined) {
            order.date = props.date;
        }
        if(props.content !== undefined) {
            order.content = props.content;
        }
        const res = await order.save();
        console.log("before return");
        return res;
    }

    async calculateOrderPrice(order: OrderProps){
        const orderLol = new OrderModel(order);
        let price: number | undefined = 0;
        let len = orderLol.content.length;
        for (let cpt = 0; cpt < len; cpt++) {
            let product = await PreparatorService.getInstance().getProductById(order.content[cpt].toString());
            const productLol = new ProductModel(product);
            price += productLol.price;
        }
        return price;
    }

    async getProductById(productId: string): Promise<ProductDocument | null> {
        return ProductModel.findById(productId).exec();
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
