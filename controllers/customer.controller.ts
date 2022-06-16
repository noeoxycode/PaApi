import express, {Request, Response, Router} from "express";
import {AuthService, CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {CustomerService} from "../services/customer.service";
import {BigBossService} from "../services/bigboss.service";
import {OrderModel, OrderProps} from "../models/order.model";
import {IngredientModel} from "../models";
import {ConversationModel} from "../models/conversation.model";
import {DeliverService} from "../services/deliver.service";

export class CustomerController {

    async createProduct(req: Request, res: Response) {
        const product = req.body;
        if(!product.name || !product.price || !product.type || !product.description) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const product = await CustomerService.getInstance().createProduct({
                name: req.body.name,
                photo: req.body.photo,
                price: req.body.price,
                description: req.body.description,
                type: req.body.type,
            });
            res.json(product);
        } catch(err) {
            res.status(400).end();
        }
    }

    async createMenu(req: Request, res: Response) {
        const menu = req.body;
        if(!menu.name || !menu.price || !menu.description || !menu.content) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const menu = await CustomerService.getInstance().createMenu({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                content: req.body.content,
            });
            res.json(menu);
        } catch(err) {
            res.status(400).end();
        }
    }

    async createPromo(req: Request, res: Response) {
        const promo = req.body;
        if(!promo.name || !promo.price || !promo.promotionType) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const promo = await CustomerService.getInstance().createPromo({
                name: req.body.name,
                price: req.body.price,
                promotionType: req.body.promotionType,
                beginDate: req.body.beginDate,
                endDate: req.body.endDate,
                content: req.body.content
            });
            res.json(promo);
        } catch(err) {
            res.status(400).end();
        }
    }

    async createOrder(req: Request, res: Response) {
        const order = req.body;
        if(!order.date || !order.status) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        let price = await this.calculateOrderPrice(new OrderModel(req.body));
        console.log(price);
        try {
            const order = await CustomerService.getInstance().createOrder({
                price: price,
                status: req.body.status,
                customerId: req.body.customerId,
                preparatorId: req.body.preparatorId,
                date: req.body.date,
                content: req.body.content,
                idResto: req.body.idResto,
                adress: req.body.adress,
                location: req.body.location
            });
            res.json(order);
        } catch(err) {
            res.status(400).end();
        }
        this.calculateOrderPrice(order);
    }

    async getAllCustomer(req: Request, res: Response) {
        const customers = await CustomerService.getInstance().getAllCustomer();
        res.json(customers);
    }

    async getProduct(req: Request, res: Response) {
        try {
            const product = await CustomerService.getInstance().getProductById(req.params.product_id);
            if(product === null) {
                res.status(404).end();
                return;
            }
            res.json(product);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async getMenu(req: Request, res: Response) {
        try {
            const menu = await CustomerService.getInstance().getMenuById(req.params.menu_id);
            if(menu === null) {
                res.status(404).end();
                return;
            }
            res.json(menu);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async getAllResto(req: Request, res: Response) {
        const resto = await BigBossService.getInstance().getAllResto();
        res.json(resto);
    }

    async getPromo(req: Request, res: Response) {
        try {
            const promo = await CustomerService.getInstance().getPromoById(req.params.promo_id);
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

    async getAllProduct(req: Request, res: Response) {
        const product = await CustomerService.getInstance().getAllProduct();
        res.json(product);
    }

    async getAllMenu(req: Request, res: Response) {
        const menu = await CustomerService.getInstance().getAllMenu();
        res.json(menu);
    }
    async getAllPromo(req: Request, res: Response) {
        const promo = await CustomerService.getInstance().getAllPromo();
        res.json(promo);
    }

    async getAllOrder(req: Request, res: Response) {
        const order = await CustomerService.getInstance().getAllOrder();
        res.json(order);
    }

    async updateOrder(req: Request, res: Response) {
        try {
            const order = await CustomerService.getInstance().updateOrderById(req.params.order_id, req.body);
            if (!order) {
                res.status(404).end();
                return;
            }
            res.json(order);
        } catch (err) {
            res.status(400).end();
        }
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

    async calculateOrderPrice(order: OrderProps){
        const orderLol = new OrderModel(order);
        let price: number | undefined = 0;
        let len = orderLol.content.length;
        for (let cpt = 0; cpt < len; cpt++) {
            let product = await CustomerService.getInstance().getProductById(order.content[cpt].toString());
            const productLol = new IngredientModel(product);
            price += productLol.price;
        }
        return price;
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(checkUserConnected("Customer"));
        router.get('/getProduct/:product_id', this.getProduct.bind(this)); // permet d'afficher un produit  OK
        router.get('/getAllProducts', this.getAllProduct.bind(this)); // permet d'afficher tous les produits  OK

        router.get('/getMenu/:menu_id', this.getMenu.bind(this)); // permet d'afficher un customer  OK
        router.get('/getAllMenu', this.getAllMenu.bind(this)); // permet d'afficher tous les customers  OK

        router.get('/getAllPromos', this.getAllPromo.bind(this)); // permet d'afficher toutes les promos  OK
        router.get('/getPromo/:promo_id', this.getPromo.bind(this)); // permet d'afficher une promo  OK

        router.get('/getAllResto', this.getAllResto.bind(this)); // permet d'afficher tous les restos  OK

        router.post('/newOrder', express.json(), this.createOrder.bind(this)); // permet de creer une Order  OK
        router.put('/updateOrder/:order_id', express.json(), this.updateOrder.bind(this)); // update Order  OK
        router.get('/orderLocation/:order_id', this.updateOrder.bind(this)); // avoir la localisation de la commande

        router.post('/postMessage/:customer_id/:deliver_id', express.json(), this.sendMessage.bind(this));

        return router;
    }
}
