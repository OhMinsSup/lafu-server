import './config/env';
import app from './app';
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Lafu server is listening to port', PORT);
});
