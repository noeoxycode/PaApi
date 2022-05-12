import express, {Request, Response, Router} from "express";
import {AuthService, CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {AdminService} from "../services/admin.service";

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

    async createAdmin(req: Request, res: Response) {
        const admin = req.body;
        if(!admin.login || !admin.password || !admin.role) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const user = await AdminService.getInstance().createEmployee({
                login: req.body.login,
                password: req.body.password,
                role: req.body.role,
                restaurant: req.body.restaurant
            });
            res.json(user);
        } catch(err) {
            res.status(400).end();
        }
    }

    async deleteAdmin(req: Request, res: Response) {
        try {
            const success = await AdminService.getInstance().deleteAdminById(req.params.admin_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async restoToAdmin(req: Request, res: Response) {
        if(!req.body.resto_id || !req.body.admin_id) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const admin = await AdminService.getInstance().affectRestoToAdmin(req.body.resto_id,req.body.admin_id);
            if (!admin) {
                res.status(404).end();
                return;
            }
            res.json(admin);
        } catch (err) {
            res.status(400).end();
        }
    }

    async updateAdmin(req: Request, res: Response) {
        try {
            const admin = await AdminService.getInstance().updateAdminById(req.params.admin_id, req.body);
            if (!admin) {
                res.status(404).end();
                return;
            }
            res.json(admin);
        } catch (err) {
            res.status(400).end();
        }
    }

    async getAdminById(req: Request, res: Response) {
        try {
            const admin = await AdminService.getInstance().getuserByIdAndRole(req.params.admin_id,"Admin");
            if(admin === null) {
                res.status(404).end();
                return;
            }
            res.json(admin);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async getAllAdmin(req: Request, res: Response) {
        const admins = await AdminService.getInstance().getAllAdmin();
        res.json(admins);
    }

    async deleteResto(req: Request, res: Response) {
        try {
            const success = await AdminService.getInstance().deleteRestoById(req.params.resto_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async getResto(req: Request, res: Response) {
        try {
            const resto = await AdminService.getInstance().getRestoById(req.params.resto_id);
            if(resto === null) {
                res.status(404).end();
                return;
            }
            res.json(resto);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async getAllResto(req: Request, res: Response) {
        const resto = await AdminService.getInstance().getAllResto();
        res.json(resto);
    }

    async swapAdmin(req: Request, res: Response) {
        if(!req.user){
            res.status(400).end();
            return;
        }
        const Boss = await AdminService.getInstance().swapBoss(req.user,req.params.admin_id);
        res.json(Boss);
    }

    async updateResto(req: Request, res: Response) {
        console.log("test before try");
        try {
            console.log("test si on rentre dans le try");
            const resto = await AdminService.getInstance().updateById(req.params.resto_id, req.body);
            if (!resto) {
                res.status(404).end();
                return;
            }
            res.json(resto);
        } catch (err) {
            console.log("test si on catch");
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
        /*router.delete('/deleteProduct/:product_id', this.deleteResto.bind(this)); // permet de delete un produit
        router.put('/updateProduct/:product_id', express.json(), this.updateResto.bind(this)); // permet d'update un produit
        router.get('/getProduct/:product_id', this.getAllResto.bind(this)); // permet d'afficher un produit
        router.get('/getAllProducts', this.getAllResto.bind(this)); // permet d'afficher tous les produits
        
        router.post('/addMenu', express.json(), this.createMenu.bind(this)); // permet de creer un compte admin
        router.get('/getMenu/:menu_id', this.getMenuById.bind(this)); // permet d'afficher un admin
        router.get('/getAllMenu', this.getAllMenu.bind(this)); // permet d'afficher tous les admins
        router.put('/updateMenu/:menu_id', express.json(), this.updateMenu.bind(this)); // update admin
        router.delete('/deleteMenu/:menu_id', this.deleteMenu.bind(this)); // permet de supp un compte admin

        router.post('/addPromo', express.json(), this.createPromo.bind(this)); // permet d'ajouter une promo au menu
        router.delete('/deletePromo/:promo_id', this.deletePromo.bind(this)); // permet de delete une promo
        router.put('/updatePromo/:promo_id', express.json(), this.updatePromo.bind(this)); // permet d'update une promo
        router.get('/getPromo/:promo_id', this.getAllPromo.bind(this)); // permet d'afficher une promo
        router.get('/getAllPromos', this.getAllPromo.bind(this)); // permet d'afficher toutes les promos

        router.post('/subscribeOrder', express.json(), this.createOrder.bind(this)); // permet de creer un compte Order
        router.get('/getOrder/:order_id', this.getOrderById.bind(this)); // permet d'afficher un Order
        router.get('/getAllOrder', this.getAllOrder.bind(this)); // permet d'afficher tous les Orders
        router.put('/updateOrder/:order_id', express.json(), this.updateOrder.bind(this)); // update Order
        router.delete('/deleteOrder/:order_id', this.deleteOrder.bind(this)); // permet de supp un compte Order
*/
        return router;
    }
}
