const express = require('express');
const app = express();
const sequelize = require('./models/index.js');
const clienteRoutes = require('./routes/clientes');
require('dotenv').config();

app.use(express.json());
app.use('/', clienteRoutes);

const port = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco estabelecida com sucesso.');
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });
