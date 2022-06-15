import express, {Request, Response, Router} from "express";
import {AuthService, CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {DeliverService} from "../services/deliver.service";
import {BigBossService} from "../services/bigboss.service";
import {OrderModel, OrderProps} from "../models/order.model";
import {IngredientModel} from "../models";
import {ConversationModel} from "../models/conversation.model";

export class DeliverController {
    async getOrder(req: Request, res: Response) {
        try {
            const promo = await DeliverService.getInstance().getOrderById(req.params.order_id);
            if(promo === null) {
                res.status(404).end();
                return;
            }
            res.json(promo);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async getAllOrder(req: Request, res: Response) {
        const order = await DeliverService.getInstance().getAllOrder();
        res.json(order);
    }

    async updateOrder(req: Request, res: Response) {
        try {
            const order = await DeliverService.getInstance().updateOrderById(req.params.order_id, req.body);
            if (!order) {
                res.status(404).end();
                return;
            }
            res.json(order);
        } catch (err) {
            res.status(400).end();
        }
    }

    async calculateOrderPrice(order: OrderProps){
        const orderLol = new OrderModel(order);
        let price: number | undefined = 0;
        let len = orderLol.content.length;
        for (let cpt = 0; cpt < len; cpt++) {
            let product = await DeliverService.getInstance().getProductById(order.content[cpt].toString());
            const productLol = new IngredientModel(product);
            price += productLol.price;
        }
        return price;
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    async sendMessage(req: Request, res: Response){
        const message = req.body;
        if(!message.content || !message.idExpediteur || !message.sentDate) {
            res.status(111).end(); // 400 -> bad request
            return;
        }
        try {
            let conversation = new ConversationModel(await DeliverService.getInstance().getConversationByIdCustomerAndDeliver(req.params.customer_id, req.params.deliver_id));
            if(conversation.id != undefined && conversation.customerId != undefined && conversation.deliverId != undefined){
                try {
                    const message = await DeliverService.getInstance().postMessage({
                        idExpediteur: req.body.idExpediteur,
                        content: req.body.content,
                        sentDate: req.body.sentDate,
                        idConversation: conversation.id.toString()
                    });
                    let idMessage = message?.id;
                    console.log("id message " + idMessage);
                    console.log("id conv " + conversation.id);
                    let updatedNewConv =await DeliverService.getInstance().addMessage(conversation.id, idMessage);
                    res.json(message);
                } catch(err) {
                    res.status(222).end();
                }
            }
            else {
                try {
                    console.log("coucou");
                    let conversation = await DeliverService.getInstance().createConversation({
                        customerId: req.params.customer_id,
                        deliverId: req.params.deliver_id,
                        createdDate: req.body.sentDate,
                        messages: ["000000000000000000000000"]
                    });
                    res.json(conversation);
                    let newConv = await DeliverService.getInstance().getConversationByIdCustomerAndDeliver(req.params.customer_id, req.params.deliver_id)
                    let idNewConv = newConv?.id;
                    const message = await DeliverService.getInstance().postMessage({
                        idExpediteur: req.body.idExpediteur,
                        content: req.body.content,
                        sentDate: req.body.sentDate,
                        idConversation: idNewConv
                    });
                    let idMessage = message?.id;
                    let updatedNewConv =await DeliverService.getInstance().updateConversationFirstMessage(idNewConv, idMessage);
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
            const conv = await DeliverService.getInstance().getConversationByIdCustomerAndDeliver(req.params.customer_id, req.params.deliver_id);
            if(conv === null) {
                res.status(404).end();
                return;
            }
            res.json(conv);
        } catch(err) {
            res.status(124).end();
            return;
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(checkUserConnected("Livreur"));
        router.get('/getAllOrders', this.getAllOrder.bind(this)); // permet d'afficher toutes les orders  OK
        router.get('/getOrder/:order_id', this.getOrder.bind(this)); // permet d'afficher une order  OK

        router.post('/postMessage/:customer_id/:deliver_id', express.json(), this.sendMessage.bind(this));

        router.put('/updateOrder/:order_id', express.json(), this.updateOrder.bind(this)); // update Order  OK

        return router;
    }
}
