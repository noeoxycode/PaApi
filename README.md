PROJET ANNUEL


Technologies utilisées : node, mongoDB, express, typescript

Fonctionnalités de l’application : 
Création d'une API typescript connectée à une base de données mongoDb. 
Le serveur node fonctionne avec express sur le port 3001. 
La base de donnée est composée des tables : Conversations, Menu, Messages, Orders, Product, Promotion, Resto, Session, Users

Il faut se login pour pouvoir utiliser l'API.
Une notion de permission est mise en place : un customer ne peut ajouter des recettes par exemple.


L'ensemble des requêtes disponibles sont définies dans le sujet.
Chaque rôle a ses endPoints dans son controler.
Lien vers le postman PApi pour simuler les requêtes : le corps de requête est d'ores et déjà fournis mais peut être modifié à volonté.

https://app.getpostman.com/join-team?invite_code=b3646e4d14dcd1ae42a7849329923966&target_code=db50cd0aebb39409db4890ebec35de3a

Attention : un seul accès postman disponible


Pré-requis : avoir nodeJs et typeScript installés et opérationnels.
Ajouter un fichier .env à la racine du fichier.
Merci de me contacter à l'adresse suivante pour obtenir le contenu du fichier : 
noe@marleix.com

Utiliser la commande ci-dessous à la racine du projet pour l'initialiser : npm install
Pour run le serveur : ng serve

Versioning : Le workflow utilisé est Feature branch. Ce choix semble être le plus pertinent car il s'agit d'un projet qui possède de multiples petites fonctionnalités à ajouter. Il semble donc pertinent d'isoler chaque ajout de fonction afin de retracer la source d'un potentiel bug. Le merge des feature branch s'effectue à l'aide de pull request.

Code API disponible sur GitHub : https://github.com/noeoxycode/PaApi
Code Front disponible sur GitHub : https://github.com/LucasLeclerc/burgerESGI