import express, {Request, Response, Router} from "express";
import {AuthService, CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {BigBossService} from "../services/bigboss.service";

export class BigBossController {

    async createResto(req: Request, res: Response) {
        console.log("begening create resto");
        const resto = req.body;
        if(!resto.name || !resto.adress || !resto.admin) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        console.log("before try");
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

    async deleteResto(req: Request, res: Response) {
        try {
            const success = await BigBossService.getInstance().deleteById(req.params.resto_id);
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
            const resto = await BigBossService.getInstance().getById(req.params.resto_id);
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
        const resto = await BigBossService.getInstance().getAll();
        res.json(resto);
    }

    async updateResto(req: Request, res: Response) {
        console.log("test before try");
        try {
            console.log("test si on rentre dans le try");
            const resto = await BigBossService.getInstance().updateById(req.params.resto_id, req.body);
            if(!resto) {
                res.status(404).end();
                return;
            }
            res.json(resto);
        } catch (err) {
            console.log("test si on catch");
            res.status(400).end();
        }
    }

    async logUser(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            const session = await AuthService.getInstance().logIn({
                login: req.body.login,
                password: req.body.password
            }, platform);
            res.json({
                token: session?._id
            });
        } catch(err) {
            res.status(401).end(); // unauthorized
        }
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(checkUserConnected());
        router.post('/createResto', express.json(), this.createResto.bind(this)); // permet d'ajouter un nouveau resto
        router.delete('/deleteResto/:resto_id', this.deleteResto.bind(this)); // permet de delete un resto
        router.get('/getResto/:resto_id', this.getResto.bind(this)); // permet d'afficher un resto
        router.put('/updateResto/:resto_id', express.json(), this.updateResto.bind(this)); // permet d'update un resto
        router.get('/getAllResto', this.getAllResto.bind(this)); // permet d'afficher tous les restos

        /*router.post('/subscribeAdmin', express.json(), this.createUser.bind(this)); // permet de creer un compte admin
        router.delete('/deleteAdmin', this.createUser.bind(this)); // permet de supp un compte admin
        router.put('/affectAdminToResto', express.json(), this.createUser.bind(this)); // affecte un admin a un resto
        router.put('/updateAdmin', express.json(), this.createUser.bind(this)); // update admin
        router.get('/getAdmin', this.createUser.bind(this)); // permet d'afficher un admin
        router.get('/getAllAdmin', this.createUser.bind(this)); // permet d'afficher tous les admins

        router.get('/whoAmI', this.createUser.bind(this)); // who am i

        router.post('/newBigBoss', express.json(), this.createUser.bind(this)); // change de big boss
*/
        return router;
    }
}
