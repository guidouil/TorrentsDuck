# Deploy Torrents Duck with Meteor Up

**[Torrents Duck](https://github.com/guidouil/TorrentsDuck) is a multi users responsive all-in-one seedbox webapp made in Node.js**

## Warning

This deploy script was made on a Mac with a [proper terminal](https://www.iterm2.com/). On Linux this *Should Just Work*™ but it was not tested on Windows... Send me a feedback if you give it a try 😃

## Prerequisites

* A freshly installed Ubuntu 14 or 16 64bit server with a sudoer user *(please not as root)* to deploy the seedbox app on it.
  * The user need to be able to [sudo without password](http://meteor-up.com/docs.html#ssh-based-authentication-with-sudo) *(this is the only time you might need to ssh into the server)*.
* a domain or sub domain pointing to the server.

⚠️ NOTE: **All the commands are executed from your PC and not by shh from the server**, `mup` injects the dependencies and the app to the server for you. ⚠️

You must have the following tools installed on your PC (not on the server)

* Git ➡️ [install instructions](https://git-scm.com/downloads)
* Meteor ➡️ [install instructions](https://www.meteor.com/install)
* Node.js ➡️ [install instructions](https://nodejs.org/)
* Meteor Up ➡️ [install instructions](http://meteor-up.com/)

# Deployement in 6 steps

## 1. Get the source code
Open your favorite terminal and go into the directory which you want to store `Torrents Duck` source code and type the following command. This directory is referenced as `path/to/app` later on.

```sh
git clone https://github.com/guidouil/TorrentsDuck.git
```

## 2. Setting up Meteor Up for your server *(this is the hardest part)*

Now that you have all dependencies and the source code, we are going to setup Meteor Up to inject the seedbox to your server. Go in source code folder on your local machine and init `mup` with the following commands:

```sh
cd path/to/app
mkdir .deploy && cd .deploy
mup init
cp -f ../private/settings-dist.json ./settings.json
cp -f ../private/mup-dist.js ./mup.js
```

Now you have to edit the server informations presents in the `.deploy/mup.js` file. You have to change all iterations of the following words with what is appropriate for your server:

* MY.SERVER.IP.ADDRESS
* MY_SERVER_SUDOER_USERNAME
* MY_SERVER_SUDOER_USERNAME_PASSWORD
* MY_DOMAIN

You must also change `MY.SERVER.IP.ADDRESS` in the `.deploy/settings.json` file

If you change a path in the `.deploy/settings.json` file, please make sure to change the `volumes:` in `.deploy/mup.js` alike.

## 3. Setting up the ubuntu server

This is going to install Docker, nginx, MongoDB and other dependencies... and yes it is all executed from your PC.

```sh
cd path/to/app
cd .deploy
mup setup
```

## 4. Build the app and deploy it to the server

This is also the same command to upgrade after you `pull` updates from git or simply restart the app

```sh
cd path/to/app
cd .deploy
mup deploy
```

Now the web interface is ready but we're still missing the FTP

## 5. Open the ports for FTP passive mode with iptable

To make FTP accessible from the Internet, we need to translate some ports to your container. Adapt the following commands if you changed the ports from `.deploy/settings.json`.

```sh
cd path/to/app
cd .deploy
mup ssh
sudo iptables -t nat -A DOCKER -p tcp --dport 9876 -j DNAT --to-destination 172.17.0.5:9876
sudo iptables -t nat -A DOCKER -p tcp --dport 8000:9000 -j DNAT --to-destination 172.17.0.5:8000-9000
```

You can check the setted iptables rules with this command: `sudo iptables -t nat -L -n`

## 6. Get admin right

This is not a "bug" : **only the first account of the platform gets admin rights** (for now). So you need to create the first user using the `sign-up` from the website we just deployd. Once you have your first account, you need to restart the node application hosted on your server with the following commands :

```sh
cd path/to/app
cd .deploy
mup meteor restart
```

You are now ready to download at the speed of Node.js and validate new users 😱

---

## Useful `mup` commands

All `mup` commands must be run from the `.deploy` folder of the app from your PC.

```sh
// Get system status
mup status
mup meteor status
mup mongo status
mup nginx status

// If you change anything innside mup.js, please run:
mup reconfigure
mup deploy

// You can run this as many times as you want it does not reset the datas ;)
mup setup

// and of course
mup help
mup meteor help
```

Also you might want to refer to [Meteor Up documentation](http://meteor-up.com/docs.html)

## Feedbacks

Please open a issue or submit a PR 😃
