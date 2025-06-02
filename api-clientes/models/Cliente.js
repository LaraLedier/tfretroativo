const { DataTypes } = require('sequelize');
const sequelize = require('./index');






const Cliente = sequelize.define('Cliente', {
  codigo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  data_nascimento: DataTypes.DATEONLY,
  rg: DataTypes.STRING(20),
  cpf: { type: DataTypes.STRING(14), unique: true },
  telefone: DataTypes.STRING(20),
  endereco: DataTypes.STRING(255),
  numero: DataTypes.STRING(10),
  cidade: DataTypes.STRING(100),
  uf: DataTypes.STRING(2),
  cep: DataTypes.STRING(9),
}, {
  tableName: 'clientes',
  timestamps: false,
});

module.exports = Cliente;
