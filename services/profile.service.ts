import {CartDocument, CartModel, CartProps} from "../models/cart.model";
import {RecipeDocument, RecipeModel, RecipeProps} from "../models/recipe.models";
import {Schema} from "mongoose";
import {UserDocument, UserModel, UserProps} from "../models";
import {RestoDocument, RestoModel} from "../models/restau.model";
import {ToolDocument, ToolModel, ToolProps} from "../models/tools.model";
import {CoffeeDocument, CoffeeModel, CoffeeProps} from "../models/coffee.model";
import {ConversationDocument, ConversationModel, ConversationProps} from "../models/conversation.model";
import {MessageDocument, MessageModel, MessageProps} from "../models/message.model";
export class ProfileService {
    private static instance?: ProfileService;
    public static getInstance(): ProfileService {
        if(ProfileService.instance === undefined) {
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance;
    }
    private constructor() { }

    async updateUser(user: UserDocument | null, props: UserProps): Promise<UserDocument | null> {
        console.log("begin of update user");
        const newUSer = new UserModel(user);
        if(!newUSer) {
            return null;
        }
        if(props.name !== undefined) {
            newUSer.name = props.name;
        }
        if(props.surname !== undefined) {
            newUSer.surname = props.surname;
        }
        if(props.birthdate !== undefined) {
            newUSer.birthdate = props.birthdate;
        }
        if(props.adress !== undefined) {
            newUSer.adress = props.adress;
        }
        if(props.email !== undefined) {
            newUSer.email = props.email;
        }
        const updatedUSer = await newUSer.save();
        return updatedUSer;
    }

    async getConversationByIdCustomerAndDeliver(customerId: string, deliverId: string): Promise<ConversationDocument| null> {
        return ConversationModel.findOne({
            customerId: customerId,
            deliverId: deliverId
        }).exec();
    }

    async getConversationById(convId: string): Promise<ConversationDocument| null> {
        return ConversationModel.findById(convId).exec();
    }

    async postMessage(props: MessageProps): Promise<MessageDocument| null> {
        const model = new MessageModel(props);
        const message = await model.save();
        return message;
    }

    async createConversation(props: ConversationProps): Promise<ConversationDocument | null> {
        const model = new ConversationModel(props);
        const conv = await model.save();
        return conv;
    }

    async updateConversationFirstMessage(convId: string, messageId: string): Promise<ConversationDocument | null> {
        const conv = await this.getConversationById(convId);
        if(!conv) {
            return null
        }
        conv.messages = [messageId];
        console.log("first message " + conv.messages);
        const res = await conv.save();
        return res;
    }

    async addMessage(convId: string, messageId: string): Promise<ConversationDocument | null> {
        const conv = await this.getConversationById(convId);
        console.log("conv id " + convId);
        if(!conv) {
            return null
        }
        // @ts-ignore
        conv.messages.push(messageId);
        console.log("add message " + conv.messages);
        const res = await conv.save();
        return res;
    }

}
