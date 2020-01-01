const fs = require('fs').promises;

class Logger {
  constructor(filePath) {
    this.filePath = filePath;
    this.init();
  }

  async init() {
    this.file = await fs.open(this.filePath, 'a');
  }

  async log(value) {
    if (!this.file) return;
    this.file.write(`${value}\n`);
  }
}

module.exports = Logger;
