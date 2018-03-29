import WebTorrent from 'webtorrent';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import Transfers from '../../api/transfers/transfers.js';

Meteor.startup(() => {
  const webTorrentClient = new WebTorrent();

  // on startup and error all transfers should be mark as stopped
  async function transfersStopped() {
    await Transfers.update({}, { $set: { stopped: true } }, { multi: true });
  }
  webTorrentClient.on('ready', () => {
    transfersStopped();
  });
  webTorrentClient.on('error', () => {
    transfersStopped();
  });

  Meteor.setInterval(() => {
    const { torrents } = webTorrentClient;
    if (torrents && torrents.length) {
      _.each(torrents, (torrent) => {
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
              size: torrent.length,
              stopped: false,
            },
          },
        );
      });
    }
  }, 3333);

  export default webTorrentClient;
});

