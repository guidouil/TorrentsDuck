# Deployer Torrent Duck avec Meteor Up

**[Torrents Duck](https://github.com/guidouil/TorrentsDuck) est une seedbox tout-en-un, multi utilisateurs et responsive écrite en Node.js**

## Avertissement

Ce script de déploiement a été fait avec un Mac à jours et un [bon terminal](https://www.iterm2.com/). Sur un Linux, ça *Devrait Juste Marcher*™. Par contre il n'a pas été testé sous Windows... N'hésitez-pas à me faire vos retours 😃

## Pré-requis

* Ubuntu Server 14 ou 16 64bits fraichement installé avec un utilisateur sudoer
  * **Ne déployez pas cette application en tant que root**

* Cet utilisateur doit pouvoir exécuter [sudo sans mot de passe](http://meteor-up.com/docs.html#ssh-based-authentication-with-sudo)
  * (Il s'agit de la seule fois où vous aurez besoin de vous connecter en SSH à votre serveur)*.

* Un nom de domaine, ou sous domaine qui mene vers votre serveur tout neuf

⚠️ NOTE: **Toutes les commandes sont exécutées à partir de votre PC et non directement en SSH depuis votre serveur**. `mup` injecte les dépendances et les applications sur votre serveur à votre place. ⚠️

Vous devez installer les applications suivantes sur votre PC

* Git ➡️ [Instructions d'installation](https://git-scm.com/downloads)
* Meteor ➡️ [Instructions d'installation](https://www.meteor.com/install)
* Node.js  ➡️ [Instructions d'installation](https://nodejs.org/)
* Meteor Up ➡️ [Instructions d'installation](http://meteor-up.com/)

# Déployement en 7 étapes

## 1. Récuperer le code source

Ouvrez votre terminal favoris et rendez vous dans le dossier où vous vouler conserver le code source de `Torrents Duck` dans votre PC.

Le dossier choisi sera désigné par `path/to/TorrentsDuck` par la suite.

```sh
git clone https://github.com/guidouil/TorrentsDuck.git
```

## 2. Parametrer Meteor Up pour votre serveur *(étape la plus compliquée)*

Maintenant que vous disposez de toutes les dépendances et du code source, nous allons parametrer Meteor Up afin d'injecter notre seedbox dans votre serveur. `Torrents Duck` est découper en trois containers (`duck`, `torrents` et `ftp`) pour être plus stable et mieux exploiter les serveurs multi core.

Rendez-vous dans le dossier comportant le code source sur votre ordinateur et copier les scripts de déploiement `mup` avec les commandes suivantes :

```sh
cd path/to/TorrentsDuck
cp .deploy-dist .deploy
```

Vous devez maintenant éditer les informations de connexions à votre serveur dans les fichiers `.deploy/duck/mup.js`, `.deploy/torrents/mup.js` et `.deploy/ftp/mup.js`.

Vous devez changer toutes les itérations des mots suivant par les valeurs appropriées pour votre serveur :

* MY.SERVER.IP.ADDRESS
* MY_SERVER_SUDOER_USERNAME
* MY_SERVER_SUDOER_USERNAME_PASSWORD
* MY_DOMAIN

Vous devez également changer `MY.SERVER.IP.ADDRESS` dans les fichiers `.deploy/duck/settings.json`, `.deploy/torrents/mup.js` and `.deploy/ftp/mup.js`

Si vous changez un chemin dans les `settings.json` veiller à changer `volumes:` dans les `mup.js` de la même manière.

## 3. Paramétrer et déployer la webapp principale

Tout va être installé par magie ✨ **Docker, nginx, mongodb et d'autres dépendances (et aussi générer les ssl)...** et oui, tout est exécuté à partir de votre PC 😎 *(bon d'accord c'est juste les scripts de `mup` qui font tout le boulot* 😅 *)*

```sh
cd path/to/TorrentsDuck
cd .deploy/duck
mup setup
mup deploy
```

## 4. Paramétrer et déployer le client bittorent

C'est également la même commande pour mettre à jour l'application après un `git pull`.

```sh
cd path/to/TorrentsDuck
cd .deploy/torrents
mup setup
mup deploy
```

## 5. Paramétrer et déployer le serveur ftp

```sh
cd path/to/TorrentsDuck
cd .deploy/ftp
mup setup
mup deploy
```

Vérifiez l'état des containers avec le commande `mup docker ps`

Maintenant l'interface web, le client bittorent et le serveur ftp sont prêts mais il est toujours impossible de joindre le FTP.

## 6. Ouvrir les ports pour le mode FTP passif avec iptables

Nous avons besoin de rediriger des ports de votre serveur vers votre container afin de rendre accessible votre serveur FTP depuis Internet. Et pour ce faire il nous faut d'abord l'adresse IP assignée au container FTP. On peux la voire avec ces comandes

```sh
cd path/to/TorrentsDuck
cd .deploy/duck
mup ssh
docker exec -it FTP bash
ip addr show
```

Là vous obtenez une liste de deux interface réseaux. La 1ere est le localhost et la seconde est l'interface qui nous interece (eth0 en général mais ca peux varier je crois). Et de cette 2nd interface il faut prendre l'IP v4 de la seconde ligne. Pour moi c'est `172.17.0.7`

Maintenant nous pouvons enfin faire de la translation. Adaptez les commandes avec votre IP et aussi si vous avez changés les ports dans les `settings.json`.

```sh
cd path/to/TorrentsDuck
cd .deploy/duck
mup ssh
sudo iptables -t nat -A DOCKER -p tcp --dport 9876 -j DNAT --to-destination 172.17.0.7:9876
sudo iptables -t nat -A DOCKER -p tcp --dport 8000:9000 -j DNAT --to-destination 172.17.0.7:8000-9000
```

Vous pouvez vérifier le résultat de vos règles avec : `sudo iptables -t nat -L -n`

Si vous avez des routes a retirer d'une précédente installation. VOus devez d'abord lister les regles nat

```sh
sudo iptables -t nat -L --line-numbers
```

Et ensuite effacer la règle dont vous ne voulez plus par sont numéro de ligne (ici catégorie DOCKER, ligne 2)

```sh
sudo iptables -t nat -D DOCKER 2
```

## 7. Obtenir les droits d'administration

Ce n'est pas un "bug" : **Les droits d'admins sont accordés au premier compte de l'instance TorrentsDuck si il n'y a qu'un seul compte** (pour l'instant).

Pour se faire, rendez-vous simplement sur la page `/sign-up` à partir de votre navigateur sur notre site web fraichement déployé. Une fois l'utilisateur créé, nous devons redémarrer l'application avec la commande suivante

```sh
cd path/to/TorrentsDuck
cd .deploy/duck
mup meteor restart
```

Vous êtes maintenant prêt à télécharger à la vitesse de Node.js et valider les nouvaux utilisateurs ! 😱

---

## Autres commandes `mup` utiles

Toutes les commandes `mup` doivent être lancées du dossier `.deploy` de l'application à partir de votre PC

```sh
// Obtenir des informations systèmes
mup status
mup docker ps
mup meteor status
mup mongo status
mup nginx status

// Si vous changez quelque chose dans le fichier mup.js faites
mup reconfigure
mup deploy

// Vous pouvez lancer cette commande autant de fois que vous le souhaitez sans risque pour les data
mup setup

// et bien sur
mup help
mup meteor help
```

D'autres liens peuvent également vous être utile pour une compréhension plus poussée :

* [Documentation Meteor Up](http://meteor-up.com/docs.html)
* [Guide de Meteor](https://guide.meteor.com/)

## Feedbacks

N'hésitez pas à ouvrir une PR ou une Issue 😃
