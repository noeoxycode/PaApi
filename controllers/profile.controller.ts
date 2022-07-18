import express, {Router, Request, Response} from "express";
import {CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {UserDocument, UserModel} from "../models";
import {ProfileService} from "../services/profile.service";
import {ConversationModel} from "../models/conversation.model";

export class ProfileController {

    getUserByTokenSession(reqHeader: string): Promise<UserDocument | null> {
        let idsession = "";
        if(reqHeader)
            idsession = reqHeader.slice(7);
        return UserModel.findOne({
            sessions : idsession
        }).exec();
    }

    async  updateProfile(req: Request, res: Response) {
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

    async sendMessage(req: Request, res: Response){
        const message = req.body;
        if(!message.content || !message.idExpediteur || !message.sentDate) {
            res.status(111).end(); // 400 -> bad request
            return;
        }
        try {
            let conversation = new ConversationModel(await ProfileService.getInstance().getConversationByIdCustomerAndDeliver(req.params.customer_id, req.params.deliver_id));
            if(conversation.id != undefined && conversation.customerId != undefined && conversation.deliverId != undefined){
                try {
                    const message = await ProfileService.getInstance().postMessage({
                        idExpediteur: req.body.idExpediteur,
                        content: req.body.content,
                        sentDate: req.body.sentDate,
                        idConversation: conversation.id.toString()
                    });
                    let idMessage = message?.id;
                    console.log("id message " + idMessage);
                    let updatedNewConv =await ProfileService.getInstance().addMessage(conversation.id, idMessage);
                    res.json(message);
                } catch(err) {
                    res.status(222).end();
                }
            }
            else {
                try {
                    console.log("coucou");
                    let conversation = await ProfileService.getInstance().createConversation({
                        customerId: req.params.customer_id,
                        deliverId: req.params.deliver_id,
                        createdDate: req.body.sentDate,
                        messages: ["000000000000000000000000"]
                    });
                    res.json(conversation);
                    let newConv = await ProfileService.getInstance().getConversationByIdCustomerAndDeliver(req.params.customer_id, req.params.deliver_id)
                    let idNewConv = newConv?.id;
                    const message = await ProfileService.getInstance().postMessage({
                        idExpediteur: req.body.idExpediteur,
                        content: req.body.content,
                        sentDate: req.body.sentDate,
                        idConversation: idNewConv
                    });
                    let idMessage = message?.id;
                    let updatedNewConv =await ProfileService.getInstance().updateConversationFirstMessage(idNewConv, idMessage);
                    res.json(message);

                }
                catch(err) {
                    res.status(333).end();
                }
            }
        }
        catch(err) {
            res.status(444).end();
        }
        try {
            const conv = await ProfileService.getInstance().getConversationByIdCustomerAndDeliver(req.params.customer_id, req.params.deliver_id);
            if(conv === null) {
                res.status(404).end();
                return;
            }
            res.json(conv);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        //router.use();
        router.use(checkUserConnected(""));
        router.put('/updateProfile', express.json(), this.updateProfile.bind(this));
        router.post('/postMessage/:customer_id/:deliver_id', express.json(), this.sendMessage.bind(this));

        return router;
    }
}
