import {Request, RequestHandler} from "express";
import {AuthService} from "../services";
import {UserProps} from "../models";

declare module 'express' {
    export interface Request {
        user?: UserProps;
    }
}

function userAcces(role:string,user:UserProps){
    console.log("role : " + role + " user.role : " + user.role);
    if(role===""){return true;}
    if(user.role===""||user.role===undefined){return false;}
    if(role==="Customer"){
        return true;
    }else if(role==="Assistant"){
        return user.role !== "Customer";
    }else if(role==="Admin"){
        if(user.role==="Admin"||user.role==="BigBoss"){
            return true;
        }else{
            return false;
        }
    }else if(role==="BigBoss"){
        return user.role === "BigBoss";
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
            console.log("1");
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if(parts.length !== 2) {
            console.log("2");
            res.status(401).end();
            return;
        }
        if(parts[0] !== 'Bearer') {
            console.log("3");
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
                console.log("14");
                res.status(401).end();
                return;
            }
            req.user = user;
            next();
        } catch(err) {
            console.log("5");
            res.status(401).end();
        }
    }
}

