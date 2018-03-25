# Old school Meteor deploy

⚠️ Not as root user!

```sh
cd
rm -rf torrentsduck-source
rm -rf builds
git clone https://github.com/guidouil/TorrentsDuck.git  torrentsduck-source
cd torrentsduck-source
meteor npm install
meteor build ../builds/. --server-only
cd
forever stop torrentsduck
rm -rf torrentsduck
cd builds
tar xzf torrentsduck-source.tar.gz
mv bundle ../torrentsduck
cd ../torrentsduck/programs/server/
npm install
cd
export MONGO_URL='mongodb://127.0.0.1:27017/torrentsduck'
export PORT=1337
export ROOT_URL='http://cmapage.com:1337'
export METEOR_SETTINGS=$(cat ~/torrentsduck-source/settings.json)
forever start --append --uid "torrentsduck" torrentsduck/main.js
date

```
