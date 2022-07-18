import express, {Router, Request, Response} from "express";
import {CartService, CoffeeService} from "../services";
import {checkUserConnected} from "../middlewares";
import {PreparatorService} from "../services";
import {UserDocument, UserModel} from "../models";

export class PreparatorController {

    getUserByTokenSession(reqHeader: string): Promise<UserDocument | null> {
        let idsession = "";
        if(reqHeader)
            idsession = reqHeader.slice(7);
        return UserModel.findOne({
            sessions : idsession
        }).exec();
    }

    async getAllInterventions(req: Request, res: Response) {
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            let id;
            if(tmpUser && tmpUser.id)
                id = tmpUser.id
            try {
                const interventions = await PreparatorService.getInstance().getAllInterventions(id);
                res.json(interventions);

            } catch(err) {
                res.status(400).end();
            }
        }
    }

    async getAllInterventionsAfter(req: Request, res: Response) {
        const body = req.body;
        const date = body.date;
        console.log("coucou", date);
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            let id;
            if(tmpUser && tmpUser.id)
                id = tmpUser.id
            try {
                const interventions = await PreparatorService.getInstance().getAllInterventionsAfter(id);
                res.json(interventions);

            } catch(err) {
                res.status(400).end();
            }
        }
    }

    async freePreparatoratdate(req: Request, res: Response) {
        const body = req.body;
        const date = body.date;
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            let id;
            if(tmpUser && tmpUser.id)
                id = tmpUser.id
            try {
                let tmpDateAfter = date.addHours(1, date);
                const interventions = await PreparatorService.getInstance().getAllFreePreparatorAtDate(date, tmpDateAfter);
                res.json(interventions);

            } catch(err) {
                res.status(400).end();
            }
        }
    }

    async addHours(numOfHours: number, date : Date) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
        return date;
    }

    async getAllInterventionsBefore(req: Request, res: Response) {
        if(req.headers.authorization){
            const tmpUser = await this.getUserByTokenSession(req.headers.authorization);
            let id;
            if(tmpUser && tmpUser.id)
                id = tmpUser.id
            try {
                const interventions = await PreparatorService.getInstance().getAllInterventionsBefore(id);
                res.json(interventions);

            } catch(err) {
                res.status(400).end();
            }
        }
    }
    async getAllPreparator(req: Request, res: Response){
        try {
            const prep = await PreparatorService.getInstance().getPreparator();
            res.json({prep
            });
        } catch(err) {
            res.status(401).end(); // unauthorized
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        //router.use();
        router.use(checkUserConnected(""));
        router.get('/interventions', this.getAllInterventions.bind(this));
        router.get('/interventionsAfter', express.json(), this.getAllInterventionsAfter.bind(this));
        router.get('/interventionsBefore',express.json(), this.getAllInterventionsBefore.bind(this));
        router.get('/getPreparator',express.json(), this.getAllPreparator.bind(this));
        router.get('/freePreparatoratdate', express.json(), this.freePreparatoratdate.bind(this));
        return router;
    }
}
