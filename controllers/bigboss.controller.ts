import express, {Request, Response, Router} from "express";
import {AuthService, CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {BigBossService} from "../services/bigboss.service";

export class BigBossController {

    async createResto(req: Request, res: Response) {
        const resto = req.body;
        if(!resto.name || !resto.adress || !resto.admin) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const user = await BigBossService.getInstance().createResto({
                name: req.body.name,
                adress: req.body.adress,
                menu: req.body.menu,
                promotion: req.body.promotion,
                product: req.body.product,
                admin: req.body.admin
            });
            res.json(user);
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
            const user = await BigBossService.getInstance().createEmployee({
                login: req.body.login,
                password: req.body.password,
                role: req.body.role,
            });
            res.json(user);
        } catch(err) {
            res.status(400).end();
        }
    }

    async deleteAdmin(req: Request, res: Response) {
        try {
            const success = await BigBossService.getInstance().deleteAdminById(req.params.admin_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }
/*
    async restoToAdmin(req: Request, res: Response) {
        if(!req.body.resto_id || !req.body.admin_id) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const admin = await BigBossService.getInstance().affectRestoToAdmin(req.body.resto_id,req.body.admin_id);
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
            const admin = await BigBossService.getInstance().updateAdminById(req.params.admin_id, req.body);
            if (!admin) {
                res.status(404).end();
                return;
            }
            res.json(admin);
        } catch (err) {
            res.status(400).end();
        }
    }
*/
    async getAdminById(req: Request, res: Response) {
        try {
            const admin = await BigBossService.getInstance().getuserByIdAndRole(req.params.admin_id,"Admin");
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
        const admins = await BigBossService.getInstance().getAllAdmin();
        res.json(admins);
    }

    async deleteResto(req: Request, res: Response) {
        try {
            const success = await BigBossService.getInstance().deleteRestoById(req.params.resto_id);
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
            const resto = await BigBossService.getInstance().getRestoById(req.params.resto_id);
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
        const resto = await BigBossService.getInstance().getAllResto();
        res.json(resto);
    }

    async swapBigBoss(req: Request, res: Response) {
        if(!req.user){
            res.status(400).end();
            return;
        }
        const Boss = await BigBossService.getInstance().swapBoss(req.user,req.params.admin_id);
        res.json(Boss);
    }

    async updateResto(req: Request, res: Response) {
        console.log("test before try");
        try {
            console.log("test si on rentre dans le try");
            const resto = await BigBossService.getInstance().updateById(req.params.resto_id, req.body);
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
        router.use(checkUserConnected("BigBoss"));
        router.post('/createResto', express.json(), this.createResto.bind(this)); // permet d'ajouter un nouveau resto
        router.delete('/deleteResto/:resto_id', this.deleteResto.bind(this)); // permet de delete un resto
        router.get('/getResto/:resto_id', this.getResto.bind(this)); // permet d'afficher un resto
        router.put('/updateResto/:resto_id', express.json(), this.updateResto.bind(this)); // permet d'update un resto
        router.get('/getAllResto', this.getAllResto.bind(this)); // permet d'afficher tous les restos

        router.post('/subscribeAdmin', express.json(), this.createAdmin.bind(this)); // permet de creer un compte admin
        router.get('/getAdmin/:admin_id', this.getAdminById.bind(this)); // permet d'afficher un admin
        router.get('/getAllAdmin', this.getAllAdmin.bind(this)); // permet d'afficher tous les admins
        //router.put('/updateAdmin/:admin_id', express.json(), this.updateAdmin.bind(this)); // update admin
        router.delete('/deleteAdmin/:admin_id', this.deleteAdmin.bind(this)); // permet de supp un compte admin

        //router.put('/affectAdminToResto', express.json(), this.restoToAdmin.bind(this)); // affecte un admin a un resto

        router.get('/whoAmI', this.me.bind(this)); // who am i

        router.post('/newBigBoss/:admin_id', express.json(), this.swapBigBoss.bind(this)); // change de big boss
        return router;
    }
}
