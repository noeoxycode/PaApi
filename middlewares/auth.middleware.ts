import {Request, RequestHandler} from "express";
import {AuthService} from "../services";
import {UserProps} from "../models";

declare module 'express' {
    export interface Request {
        user?: UserProps;
    }
}

function userAcces(role:string,user:UserProps){
    if(role===""){return true;}
    if(role==="BigBoss"&&user.role==="BigBoss"){
        return true;
    }else if(role==="Admin"&&user.role==="Admin"){
        return true;
    }else if(role==="Customer"&&user.role==="Customer"){
        return true;
    }else if(role==="Preparator"&&user.role==="Preparator"){
        return true;
    }else if(role==="Livreur"&&user.role==="Livreur"){
        return true;
    }else{
        return false;
    }

}

export function checkUserConnected(role:string): RequestHandler {
    return async function(req: Request,
                    res,
                    next) {
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if(parts.length !== 2) {
            res.status(401).end();
            return;
        }
        if(parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        try {
            const user = await AuthService.getInstance().getUserFrom(token);
            if(user === null) {
                res.status(401).end();
                return;
            }
            if(!userAcces(role,user)){
                res.status(401).end();
                return;
            }
            req.user = user;
            next();
        } catch(err) {
            res.status(401).end();
        }
    }
}

