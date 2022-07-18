import {config} from "dotenv";
import cors from "cors";
config();

import express from "express";
import mongoose, {Mongoose} from "mongoose";
import {
   AuthController,
   BigBossController,
   CartController,
   CoffeeController,
   ProfileController,
   PreparatorController,
   RecipeController, AdminController
} from "./controllers";

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
   const recipeController = new RecipeController();
   app.use('/recipe', recipeController.buildRoutes())
   const preparatorController = new PreparatorController();
   app.use('/preparator', preparatorController.buildRoutes())
   const adminController = new AdminController();
   app.use('/admin', adminController.buildRoutes())

   app.listen(process.env.PORT, function() {
      console.log("Server listening on port " + process.env.PORT);
   });
}

startServer().catch(console.error);
