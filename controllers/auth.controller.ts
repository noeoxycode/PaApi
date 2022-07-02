import express, {Request, Response, Router} from "express";
import {AuthService} from "../services";
import {checkUserConnected} from "../middlewares";

export class AuthController {

    async createUser(req: Request, res: Response) {
        try {
            const user = await AuthService.getInstance().subscribeUser({
                login: req.body.login,
                password: req.body.password,
                name: req.body.name,
                surname: req.body.surname,
                birthdate: req.body.birthdate,
                adress: {
                    number: req.body.adress.number,
                    street: req.body.adress.street,
                    postalCode: req.body.adress.postalCode,
                    town: req.body.adress.town,
                    country: req.body.adress.country,
                },
                email: req.body.email,
                photo: req.body.photo,
            });
            console.log("coucou before json");
            res.json(user);
        } catch(err) {
            console.log("error 400");
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
        router.post('/subscribe', express.json(), this.createUser.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.post('/login', express.json(), this.logUser.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/me', checkUserConnected(""), this.me.bind(this));
        return router;
    }
}
