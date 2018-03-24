import WebTorrent from 'webtorrent';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import Transfers from '../../api/transfers/transfers.js';

Meteor.startup(() => {
  const webTorrentClient = new WebTorrent();

  // webTorrentClient.on('torrent', (torrent) => {
  //   console.log('client', torrent.infoHash);
  // });

  Meteor.setInterval(() => {
    const { torrents } = webTorrentClient;
    if (torrents && torrents.length) {
      _.each(torrents, (torrent) => {
        const files = [];
        if (torrent.files && torrent.files.length > 0) {
          _.each(torrent.files, (file) => {
            files.push(file.path);
          });
        }
        Transfers.update(
          { _id: torrent.infoHash },
          {
            $set: {
              timeRemaining: torrent.timeRemaining,
              received: torrent.received,
              downloaded: torrent.downloaded,
              uploaded: torrent.uploaded,
              downloadSpeed: torrent.downloadSpeed,
              uploadSpeed: torrent.uploadSpeed,
              progress: torrent.progress,
              ratio: torrent.ratio,
              numPeers: torrent.numPeers,
              path: torrent.path,
              files,
            }
          }
        );
      });
    }
  }, 3333);

  export default webTorrentClient;
});

