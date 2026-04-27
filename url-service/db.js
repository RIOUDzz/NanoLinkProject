const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

const Url = sequelize.define('Url', {
  original_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  short_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'urls',
  underscored: true,
  timestamps: true
});

async function initDb() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Auto-creates table if it doesn't exist
    console.log('Sequelize: SQLite Connection established and models synced.');
    return sequelize;
  } catch (error) {
    console.error('Sequelize initialization failed:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  Url,
  initDb
};
