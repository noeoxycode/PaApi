import express, {Request, Response, Router} from "express";
import {AuthService, CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {CustomerService} from "../services/customer.service";
import {BigBossService} from "../services/bigboss.service";

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
        console.log(order);
        if(!order.price || !order.date || !order.status) {
            console.log("error nono");
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            console.log("coucou nono in try")
            const order = await CustomerService.getInstance().createOrder({
                price: req.body.price,
                status: req.body.status,
                customerId: req.body.customerId,
                preparatorId: req.body.preparatorId,
                date: req.body.date,
                content: req.body.content,
                idResto: req.body.content
            });
            res.json(order);
        } catch(err) {
            res.status(400).end();
        }
    }

    async getAllCustomer(req: Request, res: Response) {
        const customers = await CustomerService.getInstance().getAllCustomer();
        res.json(customers);
    }

    async deleteProduct(req: Request, res: Response) {
        try {
            const success = await CustomerService.getInstance().deleteProductById(req.params.product_id);
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
            const success = await CustomerService.getInstance().deleteMenuById(req.params.menu_id);
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
            const success = await CustomerService.getInstance().deletePromoById(req.params.promo_id);
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
            const success = await CustomerService.getInstance().deleteOrderById(req.params.order_id);
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

    async getOrder(req: Request, res: Response) {
        try {
            const order = await CustomerService.getInstance().getOrderById(req.params.order_id);
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

    async updateProduct(req: Request, res: Response) {
        try {
            const product = await CustomerService.getInstance().updateProductById(req.params.product_id, req.body);
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
            const menu = await CustomerService.getInstance().updateMenuById(req.params.menu_id, req.body);
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
            const promo = await CustomerService.getInstance().updatePromoById(req.params.promo_id, req.body);
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

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(checkUserConnected("Customer"));
        router.get('/getProduct/:product_id', this.getProduct.bind(this)); // permet d'afficher un produit
        router.get('/getAllProducts', this.getAllProduct.bind(this)); // permet d'afficher tous les produits

        router.get('/getMenu/:menu_id', this.getMenu.bind(this)); // permet d'afficher un customer
        router.get('/getAllMenu', this.getAllMenu.bind(this)); // permet d'afficher tous les customers

        router.get('/getAllPromos', this.getAllPromo.bind(this)); // permet d'afficher toutes les promos
        router.get('/getPromo/:promo_id', this.getPromo.bind(this)); // permet d'afficher une promo

        router.get('/getAllResto', this.getAllResto.bind(this)); // permet d'afficher tous les restos

        router.post('/newOrder', express.json(), this.createOrder.bind(this)); // permet de creer un compte Order
        router.put('/updateOrder/:order_id', express.json(), this.updateOrder.bind(this)); // update Order
        router.get('/orderLocation/:order_id', this.updateOrder.bind(this)); // avoir la localisation de la commande

        return router;
    }
}
