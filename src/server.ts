import './config/env';
import app from './app';
import Database from './config/database';
const PORT = process.env.PORT || 4000;

const database = new Database();
database.getConnection();

app.listen(PORT, () => {
  console.log('Lafu server is listening to port', PORT);
});
