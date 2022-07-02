import express, {Router, Request, Response} from "express";
import {CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {UserDocument, UserModel} from "../models";
import {ProfileService} from "../services/profile.service";

export class ProfileController {

    getUserByTokenSession(reqHeader: string): Promise<UserDocument | null> {
        let idsession = "";
        if(reqHeader)
            idsession = reqHeader.slice(7);
        return UserModel.findOne({
            sessions : idsession
        }).exec();
    }

    async updateProfile(req: Request, res: Response) {
        if(req.headers.authorization){
            try {
                const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
                const user = await ProfileService.getInstance()
                    .updateUser(tmpUser, req.body);
                if(!user) {
                    res.status(404).end();
                    return;
                }
                res.json(user);
            } catch (err) {
                res.status(400).end();
            }
        }

    }

    buildRoutes(): Router {
        const router = express.Router();
        //router.use();
        router.use(checkUserConnected(""));
    router.put('/updateProfile', express.json(), this.updateProfile.bind(this));
        return router;
    }
}
