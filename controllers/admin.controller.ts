import express, {Request, Response, Router} from "express";
import {AuthService, CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {AdminService} from "../services/admin.service";
import {OrderModel, OrderProps} from "../models/order.model";
import {CustomerService} from "../services/customer.service";
import {ProductModel} from "../models";

export class AdminController {

    async createProduct(req: Request, res: Response) {
        const product = req.body;
        if(!product.name || !product.price || !product.type || !product.description) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const product = await AdminService.getInstance().createProduct({
                name: req.body.name,
                price: req.body.price,
                type: req.body.type,
                description: req.body.description,
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
            const menu = await AdminService.getInstance().createMenu({
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
            const promo = await AdminService.getInstance().createPromo({
                name: req.body.name,
                price: req.body.price,
                promotionType: req.body.promotionType,
                beginDate: req.body.beginDate,
                endDate: req.body.endDate,
                content: req.body.content,
            });
            res.json(promo);
        } catch(err) {
            res.status(400).end();
        }
    }

    async createOrder(req: Request, res: Response) {
        const order = req.body;
        if(!order.price || !order.date || !order.status || !order.idResto) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        let price = await this.calculateOrderPrice(new OrderModel(req.body));
        try {
            const order = await AdminService.getInstance().createOrder({
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
            console.log(order);
            res.json(order);
        } catch(err) {
            res.status(400).end();
        }
    }

    async calculateOrderPrice(order: OrderProps){
        const orderLol = new OrderModel(order);
        let price: number | undefined = 0;
        let len = orderLol.content.length;
        for (let cpt = 0; cpt < len; cpt++) {
            let product = await CustomerService.getInstance().getProductById(order.content[cpt].toString());
            const productLol = new ProductModel(product);
            price += productLol.price;
        }
        return price;
    }

    async getAllAdmin(req: Request, res: Response) {
        const admins = await AdminService.getInstance().getAllAdmin();
        res.json(admins);
    }

    async deleteProduct(req: Request, res: Response) {
        try {
            const success = await AdminService.getInstance().deleteProductById(req.params.product_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async deleteMenu(req: Request, res: Response) {
        try {
            const success = await AdminService.getInstance().deleteMenuById(req.params.menu_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async deletePromo(req: Request, res: Response) {
        try {
            const success = await AdminService.getInstance().deletePromoById(req.params.promo_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async deleteOrder(req: Request, res: Response) {
        try {
            const success = await AdminService.getInstance().deleteOrderById(req.params.order_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async getProduct(req: Request, res: Response) {
        try {
            const product = await AdminService.getInstance().getProductById(req.params.product_id);
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
            const menu = await AdminService.getInstance().getMenuById(req.params.menu_id);
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

    async getPromo(req: Request, res: Response) {
        try {
            const promo = await AdminService.getInstance().getPromoById(req.params.promo_id);
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

    async getOrder(req: Request, res: Response) {
        try {
            const order = await AdminService.getInstance().getOrderById(req.params.order_id);
            if(order === null) {
                res.status(404).end();
                return;
            }
            res.json(order);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async getAllProduct(req: Request, res: Response) {
        const product = await AdminService.getInstance().getAllProduct();
        res.json(product);
    }

    async getAllMenu(req: Request, res: Response) {
        const menu = await AdminService.getInstance().getAllMenu();
        res.json(menu);
    }
    async getAllPromo(req: Request, res: Response) {
        const promo = await AdminService.getInstance().getAllPromo();
        res.json(promo);
    }

    async getAllOrder(req: Request, res: Response) {
        const order = await AdminService.getInstance().getAllOrder();
        res.json(order);
    }

    async updateProduct(req: Request, res: Response) {
        try {
            const product = await AdminService.getInstance().updateProductById(req.params.product_id, req.body);
            if (!product) {
                res.status(404).end();
                return;
            }
            res.json(product);
        } catch (err) {
            console.log("test si on catch");
            res.status(400).end();
        }
    }

    async updateMenu(req: Request, res: Response) {
        try {
            const menu = await AdminService.getInstance().updateMenuById(req.params.menu_id, req.body);
            if (!menu) {
                res.status(404).end();
                return;
            }
            res.json(menu);
        } catch (err) {
            res.status(400).end();
        }
    }

    async updatePromo(req: Request, res: Response) {
        try {
            const promo = await AdminService.getInstance().updatePromoById(req.params.promo_id, req.body);
            if (!promo) {
                res.status(404).end();
                return;
            }
            res.json(promo);
        } catch (err) {
            res.status(400).end();
        }
    }

    async updateOrder(req: Request, res: Response) {
        console.log("before try");
        try {
            console.log("first line try");
            const order = await AdminService.getInstance().updateOrderById(req.params.order_id, req.body);
            if (!order) {
                res.status(404).end();
                return;
            }
            res.json(order);
        } catch (err) {
            res.status(400).end();
        }
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(checkUserConnected("Admin"));
        router.post('/addProduct', express.json(), this.createProduct.bind(this)); // permet d'ajouter un produit au menu
        router.delete('/deleteProduct/:product_id', this.deleteProduct.bind(this)); // permet de delete un produit
        router.get('/getProduct/:product_id', this.getProduct.bind(this)); // permet d'afficher un produit
        router.put('/updateProduct/:product_id', express.json(), this.updateProduct.bind(this)); // permet d'update un produit
        router.get('/getAllProducts', this.getAllProduct.bind(this)); // permet d'afficher tous les produits
        
        router.post('/addMenu', express.json(), this.createMenu.bind(this)); // permet de creer un compte admin
        router.get('/getMenu/:menu_id', this.getMenu.bind(this)); // permet d'afficher un admin
        router.get('/getAllMenu', this.getAllMenu.bind(this)); // permet d'afficher tous les admins
        router.put('/updateMenu/:menu_id', express.json(), this.updateMenu.bind(this)); // update admin
        router.delete('/deleteMenu/:menu_id', this.deleteMenu.bind(this)); // permet de supp un compte admin

        router.post('/addPromo', express.json(), this.createPromo.bind(this)); // permet d'ajouter une promo au menu
        router.delete('/deletePromo/:promo_id', this.deletePromo.bind(this)); // permet de delete une promo
        router.get('/getAllPromos', this.getAllPromo.bind(this)); // permet d'afficher toutes les promos
        router.get('/getPromo/:promo_id', this.getPromo.bind(this)); // permet d'afficher une promo
        router.put('/updatePromo/:promo_id', express.json(), this.updatePromo.bind(this)); // permet d'update une promo

        router.post('/newOrder', express.json(), this.createOrder.bind(this)); // permet de creer un compte Order
        router.get('/getOrder/:order_id', this.getOrder.bind(this)); // permet d'afficher un Order
        router.get('/getAllOrder', this.getAllOrder.bind(this)); // permet d'afficher tous les Orders
        router.put('/updateOrder/:order_id', express.json(), this.updateOrder.bind(this)); // update Order
        router.delete('/deleteOrder/:order_id', this.deleteOrder.bind(this)); // permet de supp un compte Order

        return router;
    }
}
