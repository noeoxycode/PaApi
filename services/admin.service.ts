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

export class AdminService {

    private static instance?: AdminService;

    public static getInstance(): AdminService {
        if(AdminService.instance === undefined) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }

    private constructor() { }

    public async createProduct(props: ProductProps): Promise<ProductDocument> {
        const model = new ProductModel(props);
        const product = await model.save();
        return product;
    }

    public async createMenu(props: MenuProps): Promise<MenuDocument> {
        const model = new MenuModel(props);
        const menu = await model.save();
        return menu;
    }

    public async createPromo(props: PromotionProps): Promise<PromotionDocument> {
        const model = new PromotionModel(props);
        const promo = await model.save();
        return promo;
    }

    public async createOrder(props: OrderProps): Promise<OrderDocument> {
        const model = new OrderModel(props);
        const order = await model.save();
        return order;
    }

    public async createEmployee(user:Partial<UserProps>):Promise<UserDocument>{
        if(!user.password) {
            throw new Error('Missing password');
        }
        if(!user.role) {
            throw new Error('Missing role');
        }
        if(!(user.role in Role) || user.role==="Admin"){
            throw new Error('Bad role');
        }
        const model = new UserModel({
            login: user.login,
            password: SecurityUtils.sha512(user.password),
            role:user.role

        });
        return model.save();
    }

    async deleteProductById(product_id: string): Promise<boolean> {
        const res = await ProductModel.deleteOne({_id: product_id}).exec();
        return res.deletedCount === 1;
    }

    async deleteMenuById(menu_id: string): Promise<boolean> {
        const res = await MenuModel.deleteOne({_id: menu_id}).exec();
        return res.deletedCount === 1;
    }

    async deletePromoById(promo_id: string): Promise<boolean> {
        const res = await PromotionModel.deleteOne({_id: promo_id}).exec();
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
    async getProductById(productId: string): Promise<ProductDocument | null> {
        return ProductModel.findById(productId).exec();
    }

    getMenuById(menuId: string): Promise<MenuDocument | null> {
        return MenuModel.findById(menuId).exec();
    }

    getPromoById(menuId: string): Promise<PromotionDocument | null> {
        return PromotionModel.findById(menuId).exec();
    }

    async getAllProduct(): Promise<ProductDocument[]> {
        return ProductModel.find().exec();
    }

    async getAllMenu(): Promise<MenuDocument[]> {
        return MenuModel.find().exec();
    }

    async getAllPromo(): Promise<PromotionDocument[]> {
        return PromotionModel.find().exec();
    }

    async getAllAdmin(): Promise<UserDocument[]> {
        return UserModel.find({role: "Admin"}).exec();
    }
    async updateProductById(productId: string, props: ProductProps): Promise<ProductDocument | null> {
        const product = await this.getProductById(productId);
        if(!product) {
            return null;
        }
        if(props.name !== undefined) {
            product.name = props.name;
        }
        if(props.price !== undefined) {
            product.price = props.price;
        }
        if(props.type !== undefined) {
            product.type = props.type;
        }
        if(props.description !== undefined) {
            product.description = props.description;
        }
        const res = await product.save();
        return res;
    }
    async updateMenuById(menuId: string, props: MenuProps): Promise<MenuDocument | null> {
        const menu = await this.getMenuById(menuId);
        if(!menu) {
            return null;
        }
        if(props.name !== undefined) {
            menu.name = props.name;
        }
        if(props.price !== undefined) {
            menu.price = props.price;
        }
        if(props.description !== undefined) {
            menu.description = props.description;
        }
        if(props.content !== undefined) {
            menu.content = props.content;
        }
        const res = await menu.save();
        return res;
    }

    async updatePromoById(promoId: string, props: PromotionProps): Promise<PromotionDocument | null> {
        const promo = await this.getPromoById(promoId);
        if(!promo) {
            return null;
        }
        if(props.name !== undefined) {
            promo.name = props.name;
        }
        if(props.price !== undefined) {
            promo.price = props.price;
        }
        if(props.promotionType !== undefined) {
            promo.promotionType = props.promotionType;
        }
        if(props.beginDate !== undefined) {
            promo.beginDate = props.beginDate;
        }
        if(props.endDate !== undefined) {
            promo.endDate = props.endDate;
        }
        if(props.content !== undefined) {
            promo.content = props.content;
        }
        const res = await promo.save();
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
