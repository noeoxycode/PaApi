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

    async getAllProduct(): Promise<ProductDocument[]> {
        return ProductModel.find().exec();
    }

    async swapBoss(pastBoss: UserProps,newBoss: string){
        const newB = await this.getuserByIdAndRole(newBoss,"Admin");
        if (!pastBoss || !newB) {
            return null;
        }
        const past= await UserModel.find({
            role: "Admin"
        }).exec();
        if( past.length!==1){
            return null;
        }
        newB.role=possibleRole["Admin"]
        past[0].role=possibleRole["Admin"]
        const res1 = await newB.save();
        const res2 = await past[0].save();
        return {res1,res2};
    }

    async getAllAdmin(): Promise<UserDocument[]> {
        return UserModel.find({role: "Admin"}).exec();
    }
    async updateById(productId: string, props: ProductProps): Promise<ProductDocument | null> {
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
