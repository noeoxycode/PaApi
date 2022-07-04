import {config} from "dotenv";
config();

import express from "express";
import {AuthController, CoffeeController, BigBossController,AdminController} from "./controllers";
import mongoose, {Mongoose} from "mongoose";
import {CustomerController} from "./controllers/customer.controller";
import {PreparatorController} from "./controllers/preparator.controller";
import {DeliverController} from "./controllers/deliver.controller";
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

   const coffeeController = new CoffeeController();
   app.use('/coffee', coffeeController.buildRoutes()); // enregistrement d'un routeur
   const authController = new AuthController();
   app.use('/auth', authController.buildRoutes())
   const bigbossController = new BigBossController();
   app.use('/bigboss', bigbossController.buildRoutes())
   const adminController = new AdminController();
   app.use('/admin', adminController.buildRoutes())
   const customerController = new CustomerController;
   app.use('/customer', customerController.buildRoutes())
   const preparatorController = new PreparatorController();
   app.use('/preparator', preparatorController.buildRoutes())
   const deliverController = new DeliverController();
   app.use('/deliver', deliverController.buildRoutes())
   const cartController = new CartController();
   app.use('/cart', cartController.buildRoutes())
   const profileController = new ProfileController();
   app.use('/profile', profileController.buildRoutes())

   app.listen(process.env.PORT, function() {
      console.log("Server listening on port " + process.env.PORT);
   });
}

startServer().catch(console.error);
