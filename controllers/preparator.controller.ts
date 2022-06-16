import express, {Request, Response, Router} from "express";
import {AuthService, CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {PreparatorService} from "../services/preparator.service";
import {BigBossService} from "../services/bigboss.service";
import {OrderModel, OrderProps} from "../models/order.model";
import {IngredientModel} from "../models";

export class PreparatorController {
    async getOrder(req: Request, res: Response) {
        try {
            const promo = await PreparatorService.getInstance().getOrderById(req.params.order_id);
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
        const order = await PreparatorService.getInstance().getAllOrder();
        res.json(order);
    }

    async updateOrder(req: Request, res: Response) {
        try {
            const order = await PreparatorService.getInstance().updateOrderById(req.params.order_id, req.body);
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
            let product = await PreparatorService.getInstance().getProductById(order.content[cpt].toString());
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
        router.use(checkUserConnected("Preparator"));
        router.get('/getAllOrders', this.getAllOrder.bind(this)); // permet d'afficher toutes les orders  OK
        router.get('/getOrder/:order_id', this.getOrder.bind(this)); // permet d'afficher une order  OK

        router.put('/updateOrder/:order_id', express.json(), this.updateOrder.bind(this)); // update Order  OK

        return router;
    }
}
