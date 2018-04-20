# Torrents Duck 🦆

A multi users bittorrents clients that quacks

⚠️ *Currently in alpha stage* ⚠️
![alt text](https://raw.githubusercontent.com/guidouil/TorrentsDuck/master/_docs/torrentsduckmainscreen.png "Torrents Duck main screen")

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to install Meteor. [Follow the instructions](https://www.meteor.com/install).

You also need a local install of MongoDB

you must have two folder writable for your profile from root of hard drive `/data/torrents/` and `/data/uploads/`

### Installing and running the main app

Clone or download this repositery and using your terminal in `TorrentsDuck/duck` folder and install dependencies

```
meteor npm install
```

Once done, you can run your local copy with this command of the front end

```
export MONGO_URL='mongodb://127.0.0.1:27017/TorrentsDuck' && meteor --settings private/settings-dev.json -p 3000
```

Now go register on [http://localhost:3000](http://localhost:3000). First user registered get admin rights but only after a meteor server restart if there is only one user.

### Installing and running the bittorrent client app

In another terminal go to the `TorrentsDuck/torrents` directory and install dependencies

```
meteor npm install
```

Once done, you can run your local bittorent client

```
export MONGO_URL='mongodb://127.0.0.1:27017/TorrentsDuck' && meteor --settings private/settings-dev.json -p 3001
```

Now you can start torrents transfert from the [main interface](http://localhost:3000)

### Installing and running the FTP server

In another terminal go to the `TorrentsDuck/ftp` directory and install dependencies

```
meteor npm install
```

Once done, you can run your local ftp server

```
export MONGO_URL='mongodb://127.0.0.1:27017/TorrentsDuck' && meteor --settings private/settings-dev.json -p 3002
```

Now you can connect by ftp on `127.0.0.1:9876` using the login and password you created on the main web interface

## Running the tests

*To Be Done*™

## Deployment

[Follow the Meteor Up deployement guide](https://github.com/guidouil/TorrentsDuck/blob/master/_docs/mupDeploy.md) - [disponible en Français](https://github.com/guidouil/TorrentsDuck/blob/master/_docs/mupDeploy_FR.md)

## Built With

* [Meteor](https://www.meteor.com/) - The node.js full stack
* [webtorrent](https://webtorrent.io/) - A streaming torrent client for node.js
* [ftp-srv](https://github.com/trs/ftp-srv) - 📮 Modern FTP Server
* [Semantic-UI](https://semantic-ui.com/) - A UI component framework based around useful principles from natural language.

## Authors

* **Guillaume Darbonne** - *Initial work* - [Guidouil](https://github.com/guidouil)
* **Jérémy** - *French Doc* - [PixiBixi](https://github.com/PixiBixi)

See also the list of [contributors](https://github.com/guidouil/TorrentsDuck/contributors) who participated in this project.

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* You are responsible for what you download using the bittorent protocol
