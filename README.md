PROJET ESGI KING
Choix du sujet : API REST

Technologies utilisées : node, mongoDB, express, typescript

Fonctionnalités de l’application : 
Création d'une API typescript connectée à une base de données mongoDb. 
Le serveur node fonctionne avec express sur le port 3001. 
La base de donnée est composée des tables : Conversations, Menu, Messages, Orders, Product, Promotion, Resto, Session, Users

Il faut se login pour pouvoir utiliser l'API.
Une notion de permission est mise en place : un customer ne peut modifier un resto par exemple.

Lorsqu'une commande est en cours, le livreur et le customer ont la possibilité d'échanger par chat.
Une discussion est crée lors du premier message, puis tous les messages sont ajoutés à la suite.

L'ensemble des requêtes disponibles sont définies dans le sujet.
Chaque rôle a ses endPoints dans son controler.
Lien vers le postman esgiKing pour simuler les requêtes : le corps de requête est d'ores et déjà fournis mais peut être modifié à volonté.

https://app.getpostman.com/join-team?invite_code=5a876e5088dd859e71aa3c59528e9305&target_code=929578d6f67b40ff1a0f72c38f28a93f


Pré-requis : avoir nodeJs et typeScript installés et opérationnels.
Ajouter un fichier .env à la racine du fichier.
Merci de me contacter à l'adresse suivante pour obtenir le contenu du fichier : 
noe@marleix.com

Utiliser la commande ci-dessous à la racine du projet pour l'initialiser : npm install
Pour run le serveur : ng serve

Versioning : Le workflow utilisé est Feature branch. Ce choix semble être le plus pertinent car il s'agit d'un projet qui possède de multiples petites fonctionnalités à ajouter. Il semble donc pertinent d'isoler chaque ajout de fonction afin de retracer la source d'un potentiel bug. Le merge des feature branch s'effectue à l'aide de pull request.

Code API disponible sur GitHub : https://github.com/noeoxycode/burgerKingXD
Code Front disponible sur GitHub : https://github.com/LucasLeclerc/burgerESGI