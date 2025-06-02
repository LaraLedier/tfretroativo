const Cliente = require('../models/Cliente');

const { Op } = require('sequelize');

function validarCPF(cpf) {
  // Validação simples de CPF (ex: 000.000.000-00 ou 00000000000)
  return /^(\d{3}\.){2}\d{3}\-\d{2}$|^\d{11}$/.test(cpf);
}

function validarCEP(cep) {
  return /^\d{5}-\d{3}$/.test(cep);
}

function validarTelefone(tel) {
  return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(tel);
}

function validarData(data) {
  return !isNaN(Date.parse(data));
}

exports.createCliente = async (req, res) => {
  try {
    const { nome, cpf, cep, telefone, data_nascimento } = req.body;
    if (!nome || nome.trim() === '') return res.status(400).json({ mensagem: 'Nome é obrigatório' });
    if (cpf && !validarCPF(cpf)) return res.status(400).json({ mensagem: 'CPF inválido' });
    if (cep && !validarCEP(cep)) return res.status(400).json({ mensagem: 'CEP inválido' });
    if (telefone && !validarTelefone(telefone)) return res.status(400).json({ mensagem: 'Telefone inválido' });
    if (data_nascimento && !validarData(data_nascimento)) return res.status(400).json({ mensagem: 'Data inválida' });

    const existeCPF = await Cliente.findOne({ where: { cpf } });
    if (existeCPF) return res.status(400).json({ mensagem: 'CPF já cadastrado' });

    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch {
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

exports.getCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.codigo);
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    res.json(cliente);
  } catch {
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

exports.listClientes = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.nome) filtros.nome = { [Op.iLike]: `%${req.query.nome}%` };
    if (req.query.cidade) filtros.cidade = { [Op.iLike]: `%${req.query.cidade}%` };
    if (req.query.uf) filtros.uf = req.query.uf.toUpperCase();

    const clientes = await Cliente.findAll({ where: filtros });
    res.json(clientes);
  } catch {
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

exports.updateCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.codigo);
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });

    const { cpf, nome, cep, telefone, data_nascimento } = req.body;

    if (nome !== undefined && nome.trim() === '') return res.status(400).json({ mensagem: 'Nome não pode ser vazio' });
    if (cpf !== undefined && !validarCPF(cpf)) return res.status(400).json({ mensagem: 'CPF inválido' });
    if (cep !== undefined && !validarCEP(cep)) return res.status(400).json({ mensagem: 'CEP inválido' });
    if (telefone !== undefined && !validarTelefone(telefone)) return res.status(400).json({ mensagem: 'Telefone inválido' });
    if (data_nascimento !== undefined && !validarData(data_nascimento)) return res.status(400).json({ mensagem: 'Data inválida' });

    if (cpf && cpf !== cliente.cpf) {
      const existeCPF = await Cliente.findOne({ where: { cpf } });
      if (existeCPF) return res.status(400).json({ mensagem: 'CPF já cadastrado por outro cliente' });
    }

    await cliente.update(req.body);
    res.json(cliente);
  } catch {
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.codigo);
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });

    await cliente.destroy();
    res.status(204).send();
  } catch {
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};
