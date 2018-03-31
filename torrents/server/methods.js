import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import webTorrentClient from './webTorrentClient.js';

import Transfers from './collections/transfers.js';
import Torrents from './collections/torrents.js';
import Statistics from './collections/statistics.js';

async function upsertTransfer(_id, transfer) {
  return Transfers.upsert({ _id }, { $set: transfer });
}
async function updateTorrent(_id, torrent) {
  return Torrents.update({ _id }, { $set: torrent });
}
async function removeTransfert(_id) {
  return Transfers.remove({ _id });
}
async function removeTorrent(_id) {
  return Torrents.remove({ _id });
}

async function writeStatistics(statistics) {
  return Statistics.upsert({ _id: 'webTorrentClient' }, { $set: statistics });
}


Meteor.methods({
  startTorrent(torrentToStart) {
    this.unblock();
    if (this.connection !== null) {
      throw new Meteor.Error('403', 'Not authorized');
    }
    check(torrentToStart, Object);
    updateTorrent(torrentToStart._id, { toStart: false });
    if (torrentToStart.transferId) {
      // to avoid double torrent start issue
      const existingTorrent = webTorrentClient.get(torrentToStart.transferId);
      if (existingTorrent) {
        return false;
      }
    }
    const maxConns = Meteor.settings.torrentMaxConnections;
    const path = Meteor.settings.torrentsPath;
    const { _id, torrentRef, username, userId } = torrentToStart;
    webTorrentClient.add(torrentRef, { maxConns, path }, (torrent) => {
      if (torrent.ready) {
        upsertTransfer(torrent.infoHash, {
          name: torrent.name,
          downloadSpeed: 0,
          uploadSpeed: 0,
          timeRemaining: Infinity,
          createdAt: new Date(),
          size: torrent.length,
          stopped: false,
          torrentId: _id,
          torrentRef,
          username,
          userId,
        });
        updateTorrent(torrentToStart._id, {
          transferId: torrent.infoHash,
          name: torrent.name,
          startedAt: new Date(),
        });
      }
    });
  },

  stopTorrent(torrentToStop) {
    this.unblock();
    if (this.connection !== null) {
      throw new Meteor.Error('403', 'Not authorized');
    }
    check(torrentToStop, Object);

    if (torrentToStop.transferId) {
      updateTorrent(torrentToStop._id, { toStop: false });
      const torrent = webTorrentClient.get(torrentToStop.transferId);
      if (torrent) {
        webTorrentClient.remove(torrentToStop.transferId);
      }
      upsertTransfer(torrentToStop.transferId, {
        stopped: true,
        downloadSpeed: 0,
        uploadSpeed: 0,
        peers: 0,
      });
    }
  },

  removeTorrent(torrentToRemove) {
    this.unblock();
    if (this.connection !== null) {
      throw new Meteor.Error('403', 'Not authorized');
    }
    check(torrentToRemove, Object);

    if (torrentToRemove.transferId) {
      const torrent = webTorrentClient.get(torrentToRemove.transferId);
      if (torrent) {
        webTorrentClient.remove(torrentToRemove.transferId);
      }
      removeTransfert(torrentToRemove.transferId);
      removeTorrent(torrentToRemove._id);
    }
  },

  giveStatistics() {
    this.unblock();
    if (this.connection !== null) {
      throw new Meteor.Error('403', 'Not authorized');
    }
    const { downloadSpeed, uploadSpeed } = webTorrentClient;
    writeStatistics({ downloadSpeed, uploadSpeed });
  },
});
