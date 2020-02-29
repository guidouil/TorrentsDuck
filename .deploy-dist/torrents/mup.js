module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method (pem or password)
      host: 'MY.SERVER.IP.ADDRESS', // somthing like 42.54.13.37
      username: 'MY_SERVER_SUDOER_USERNAME',
      // pem: './path/to/pem'
      password: 'MY_SERVER_SUDOER_USERNAME_PASSWORD',
      // or neither for authenticate from ssh-agent
    },
  },

  app: {
    // TODO: change app name and path
    name: 'Torrents',
    path: '../../torrents/',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://wt.MY_DOMAIN.com',
      MONGO_URL: 'mongodb://mongodb:27017/TorrentsDuck',
      MONGO_OPLOG_URL: 'mongodb://mongodb:27017/local',
      // MAIL_URL: 'smtp://postmaster%40MY_DOMAIN.com:MAILGUN_POSTMASTER_PASSWORD@smtp.mailgun.org:587',
    },

    volumes: {
      '/data/torrents': '/data/torrents',
      '/data/uploads': '/data/uploads',
    },

    docker: {
      image: 'abernix/meteord:node-12-base',
      args: ['--link=mongodb:mongodb'],
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  proxy: {
    domains: 'wt.MY_DOMAIN.com',

    ssl: {
      // Enable Let's Encrypt
      letsEncryptEmail: 'MY_DOMAIN@gmail.com',
      forceSSL: true,
    },
  },
};
