const READ_MAIL_CONFIG = {
  imap: {
    user: 'YOUR_MAIL_ADDRESS',
    password: 'MAIL_APP_PASSWORD',
    host: 'imap.gmail.com',
    port: 993,
    authTimeout: 10000,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  },
};

const SEND_MAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'YOUR_MAIL_ADDRESS',
    pass: 'MAIL_APP_PASSWORD',
  },
};

export {
  READ_MAIL_CONFIG,
  SEND_MAIL_CONFIG
}
