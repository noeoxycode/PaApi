import {config} from "dotenv";
import cors from "cors";
config();

import express from "express";
import {AuthController, CoffeeController, BigBossController} from "./controllers";
import mongoose, {Mongoose} from "mongoose";
import {CartController} from "./controllers/cart.controller";
import {ProfileController} from "./controllers/profile.controller";

async function startServer(): Promise<void> {

   const m: Mongoose = await mongoose.connect(process.env.MONGO_URI as string, {
      auth: {
         username: process.env.MONGO_USER  as string,
         password: process.env.MONGO_PASSWORD as string
      }
   });

   const app = express();
   app.use(cors())
   app.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      next();
   });

   const coffeeController = new CoffeeController();
   app.use('/coffee', coffeeController.buildRoutes()); // enregistrement d'un routeur
   const authController = new AuthController();
   app.use('/auth', authController.buildRoutes())
   const bigbossController = new BigBossController();
   app.use('/bigboss', bigbossController.buildRoutes())
   const cartController = new CartController();
   app.use('/cart', cartController.buildRoutes())
   const profileController = new ProfileController();
   app.use('/profile', profileController.buildRoutes())

   app.listen(process.env.PORT, function() {
      console.log("Server listening on port " + process.env.PORT);
   });
}

startServer().catch(console.error);
