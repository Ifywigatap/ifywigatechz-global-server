import('./server.js').then(() => {
  console.log('server imported');
}).catch((err) => {
  console.error('Import error:', err && err.stack ? err.stack : err);
  process.exit(1);
});
