import express, {Router, Request, Response} from "express";
import {CartService, CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {AdminService} from "../services";
import {UserDocument, UserModel} from "../models";

export class AdminController {

    getUserByTokenSession(reqHeader: string): Promise<UserDocument | null> {
        let idsession = "";
        if(reqHeader)
            idsession = reqHeader.slice(7);
        return UserModel.findOne({
            sessions : idsession
        }).exec();
    }

    async getAllCurrentDemande(req: Request, res: Response) {
        if(req.headers.authorization){
            try {
                const interventions = await AdminService.getInstance().getCurrDemande();
                res.json(interventions);

            } catch(err) {
                res.status(405).end();
            }
        }
    }
    async getDemandebyId(req: Request, res: Response) {
        if(req.headers.authorization){
            try {
                const interventions = await AdminService.getInstance().getDemandeById(req.params.id_demande);
                res.json(interventions);

            } catch(err) {
                res.status(400).end();
            }
        }
    }
    async getDemandebyUser(req: Request, res: Response) {
        if(req.headers.authorization){
            try {
                const interventions = await AdminService.getInstance().getDemandeByUser(req.params.id_user);
                res.json(interventions);

            } catch(err) {
                res.status(400).end();
            }
        }
    }
    async acceptDemande(req: Request, res: Response) {
        if(req.headers.authorization){
            try {
                const interventions = await AdminService.getInstance().updateDemande(req.params.id_demande,"Accepter");
                res.json(interventions);

            } catch(err) {
                res.json(err)
                res.status(400).end();
            }
        }
    }
    async refuseDemande(req: Request, res: Response) {
        if(req.headers.authorization){
            try {
                const interventions = await AdminService.getInstance().updateDemande(req.params.id_demande,"Refuser");
                res.json(interventions);

            } catch(err) {
                res.json(err)
                res.status(400).end();
            }
        }
    }



    buildRoutes(): Router {
        const router = express.Router();
        //router.use();
        router.use(checkUserConnected("Admin"));
        router.get('/getCurrDemande', this.getAllCurrentDemande.bind(this));
        router.get('/getDemandeById/:id_demande', this.getDemandebyId.bind(this));
        router.get('/getDemandeByUser/:id_user', this.getDemandebyUser.bind(this));
        router.post('/acceptDemande/:id_demande', this.acceptDemande.bind(this));
        router.post('/refuseDemande/:id_demande', this.refuseDemande.bind(this));
        return router;
    }
}
