# Deploy Torrents Duck with Meteor Up

The multi users responsive seedbox made in JavaScript

## Getting Started

This deploy script was made on a Mac with a [proper terminal](https://www.iterm2.com/). On Linux this *Should Just Work*™ but it was not tested on Windows ... tell me if give it a try 😃

## Prerequisites

A freshly installed Ubuntu 14 or 16 64bit server with a sudoer user *(please not as root)* to deploy the seedbox app on it.
The user need to be able to [sudo without password](http://meteor-up.com/docs.html#ssh-based-authentication-with-sudo) *(this is the only time you might need to ssh into the server)*.

⚠️ NOTE: **all the commands are executed from your PC and not by shh from the server**, `mup` injects the dependencies and the app to the server for you. ⚠️

You need to have the folowing installed on your PC (not on the server)
* Git ➡️ [install instructions](https://git-scm.com/downloads)
* Meteor ➡️ [install instructions](https://www.meteor.com/install)
* Node.js ➡️ [install instructions](https://nodejs.org/)
* Meteor Up ➡️ [install instructions](http://meteor-up.com/)

## Get the source code
Open your favorite terminal and go into the directory  where you want to keep Torrents Duck source an type the following command. The directory you choose will be referenced as `path/to/app` later on.

```sh
git clone https://github.com/guidouil/TorrentsDuck.git
```

## Setting up Meteor Up for your server *(this is the hardest part)*

Now that you have all dependencies and the source code we are going to setup Meteor Up to inject the seedbox to your server. Go in source code folder on your local machine and init `mup` with the following commands

```sh
cd path/to/app
mkdir .deploy && cd .deploy
mup init
cp -f ../private/settings-dist.json ./settings.json
cp -f ../private/mup-dist.js ./mup.js
```

Now you have to edit the server info in the `.deploy/mup.js` file. You have to change all iterrations of the following words with what is appropriate for your server
* MY.SERVER.IP.ADDRESS
* MY_SERVER_SUDOER_USERNAME
* MY_SERVER_SUDOER_USERNAME_PASSWORD
* MY_DOMAIN

You must also change `MY.SERVER.IP.ADDRESS` in the `.deploy/settings.json` file

If you change one path in this `.deploy/settings.json` make sure to change the `volumes:` in `.deploy/mup.js` alike.

## Setting up the ubuntu server

This is going to install docker, nginx, mongodb and other dependencies... and yes it is executed from your PC

```sh
cd path/to/app
cd .deploy
mup setup
```

## Build the app and deploy it to the server

This is also the same command to upgrade after you `pull` updates from git or simply restart the app

```sh
cd path/to/app
cd .deploy
mup deploy
```

Now the web interface is ready but we miss the FTP

## Open the ports for FTP passive mode with iptable

We need to open some ports to make the ftp living inside the dockerized app accessible from the internet. Adapt this if you changed the port from `.deploy/settings.json`.

```sh
cd path/to/app
cd .deploy
mup ssh
sudo iptables -t nat -A DOCKER -p tcp --dport 9876 -j DNAT --to-destination 172.17.0.5:9876
sudo iptables -t nat -A DOCKER -p tcp --dport 8000:9000 -j DNAT --to-destination 172.17.0.5:8000-9000
```

You can check the setted iptables rules with this command: `sudo iptables -t nat -L -n`

## Get admin right

This is a "bug" : **only the first account of the platform gets admin rights** (for now). So you need to create the first user using the `sign-up` from the website we just deployd. And now you have your account as first user we need to restart the node application hosted on your server with the following

```sh
cd path/to/app
cd .deploy
mup deploy
```

Now you are ready to go download at the speed of node.js 😱

## Other usefull `mup` commands

All `mup` commands must be run within the `.deploy` folder of the app from your PC

```sh
// get system status
mup status
mup meteor status
mup mongo status
mup nginx status

// if you change anything innside mup.js you should run
mup reconfigure
mup deploy

// you can run this as many time as you whant
mup setup

```

Also you might whant to refer to [Meteor Up documentation](http://meteor-up.com/docs.html)

## Feedbacks

Please open a issue or submit a PR 😃
