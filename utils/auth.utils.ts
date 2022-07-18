import crypto from "crypto";
import {UserDocument, UserModel, UserProps} from "../models";
import {SessionModel} from "../models/session.model";

export class AuthUtils {
        public static sha512(str: string): string {
            const hash = crypto.createHash('sha512');
            hash.update(str);
            return hash.digest("hex");
        }

    static async checkBigBoss(): Promise<boolean> {
        const session = await UserModel.find({
            role: "BigBoss"
        }).count().exec();
        if(session===0){
            return true;
        }
        return false;
    }

    static async getUserByTokenSession(reqHeader: string): Promise<UserDocument | null> {
        let idsession = "";
        if(reqHeader)
            idsession = reqHeader.slice(7);
        return UserModel.findOne({
            sessions : idsession
        }).exec();
    }
    static async getUserById(id: string): Promise<UserDocument | null> {
        return UserModel.findOne({_id : id}).exec();
    }
}
