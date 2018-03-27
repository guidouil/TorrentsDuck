# Deployer Torrent Duck avec Meteor Up

Torrent Dock est une seedbox multi utilisateurs responsive écrit en JavaScript.

## Introductoin

Ce script de déploiement a été fait sous un Mac avec un [terminal propre](https://www.iterm2.com/). Sur un Linux, *devrait juste marcher*™ mais il n'a pas été testé sous Windows... N'hésitez-pas à me faire vos retours 😃

## Pré-requis

  * Ubuntu Server 14 ou 16 64bits fraichement installé avec un utilisateur sudoer
    * **Ne déployer pas cette application en tant que root**

  * Cet utilisateur doit pouvoir exécuter [sudo sans mot de passe](http://meteor-up.com/docs.html#ssh-based-authentication-with-sudo) 
  
    * (Il s'agit de la seule fois où vous aurez besoin de vous connecter en SSH à votre serveur)*.

⚠️ NOTE: **Toutes les commandes sont exécutées à partir de votre PC et non directement en SSH depuis votre serveur**. `mup` injecte les dépendances et les applications sur votre serveur à votre place. ⚠️

Vous devez installer les applications suivantes sur votre PC
* Git ➡️ [Instructions d'installation](https://git-scm.com/downloads)
* Meteor ➡️ [Instructions d'installation](https://www.meteor.com/install)
* Node.js  ➡️ [Instructions d'installation](https://nodejs.org/)
* Meteor Up ➡️ [Instructions d'installation](http://meteor-up.com/)

## Récuperer le code source
Ouvrez votre terminal favoris et rendez vous dans le dossier où vous vouler conserver les sources de l'application.

Le dossier choisi sera désigné par `path/to/app` par la suite.

```sh
git clone https://github.com/guidouil/TorrentsDuck.git
```

## Parametrer Meteor Up pour votre serveur *(Partie la plus compliquée)*

Maintenant que vous disposez de toutes les dépendances et du code source, nous allons parametrer Meteor Up afin d'injecter notre seedbox dans votre serveur.

Rendez-vous dans le dossier comportant le code source sur votre ordinateur et initialiser `mup` avec les commandes suivantes :

```sh
cd path/to/app
mkdir .deploy && cd .deploy
mup init
cp -f ../private/settings-dist.json ./settings.json
cp -f ../private/mup-dist.js ./mup.js
```

Vous devez maintenant éditer les informations de connexions à votre serveur dans le fichier `.deploy/mup.js`. 

Vous devez changer toutes les itérations des mots suivant par les valeurs appropriées pour votre serveur :

* MY.SERVER.IP.ADDRESS
* MY_SERVER_SUDOER_USERNAME
* MY_SERVER_SUDOER_USERNAME_PASSWORD
* MY_DOMAIN

Vous devez également changer `MY.SERVER.IP.ADDRESS` dans le fichier `.deploy/settings.json`

Si vous changez un chemin dans `.deploy/settings.json` veiller à changer `volumes:` dans `.deploy/mup.js` de la même manière.

## Setting up the ubuntu server

This is going to install docker, nginx, mongodb and other dependencies... and yes it is executed from your PC
Tout va être installé par magie : Docker, nginx, mongodb et d'autres dépendances... et oui, tout est exécuté à partir de votre PC. :-)

```sh
cd path/to/app
cd .deploy
mup setup
```

## Construire l'application et la déployer sur le serveur

C'est également la même commande pour mettre à jour l'application après un `pull` des mises à jour à partir de Git.
This is also the same command to upgrade after you `pull` updates from git or simply restart the app

```sh
cd path/to/app
cd .deploy
mup deploy
```

L'interface Web est maintenant opérationnelle, mais il nous manque encore le FTP

## Ouvrir les ports pour le mode FTP passif avec iptables.



Nous avons besoin de rediriger des ports de votre serveur vers votre container afin de rendre accessible votre serveur FTP depuis Internet. Adapter les commandes si vous avez changés les ports `.deploy/settings.json`.

```sh
cd path/to/app
cd .deploy
mup ssh
sudo iptables -t nat -A DOCKER -p tcp --dport 9876 -j DNAT --to-destination 172.17.0.5:9876
sudo iptables -t nat -A DOCKER -p tcp --dport 8000:9000 -j DNAT --to-destination 172.17.0.5:8000-9000
```

Vous pouvez vérifier le résultat de vos règles avec : `sudo iptables -t nat -L -n`

## Obtenir les droits d'administration

Ce n'est pas un "bug" : **Les droits d'admins sont accordés au premier compte de l'instance TorrentDuck** (for now). 

Pour se faire, rendez-vous simplement `sign-up` à partir de votre navigateur sur notre site web fraichement déployé. Une fois l'utilisateur créé, nous devons redémarrer l'application avec la commande suivante

```sh
cd path/to/app
cd .deploy
mup restart
```

Vous êtes maintenant prêt à télécharger à la vitesse du NodeJS ! 😱

## Autre commandes `mup` utiles

Toutes les commandes `mup` doivent être lancées du dossier `.deploy` de l'application à partir de votre PC

```sh
// Obtenir des informations systèmes
mup status
mup meteor status
mup mongo status
mup nginx status

// Si vous changez quelque chose à l'intérieur de mup.js
mup reconfigure
mup deploy

// Vous pouvez lancer cette commande autant de fois que vous le souhaitez
mup setup

```

D'autres liens peuvent également vous être utile pour une compréhension plus poussée :

  * [Documentation Meteor Up](http://meteor-up.com/docs.html)

## Feedbacks

N'hésitez pas à ouvrir une PR ou une Issue 😃
