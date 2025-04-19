// routes/produtos.js
import express from 'express';
import {
  criaProduto,
  leProdutos,
  leProdutosPorId,
  atualizaProdutosPorId,
  deletaProdutosPorId
} from './../models.js';

export const rotasProdutos = express.Router();

// Criar produto
rotasProdutos.post('/produtos', async (req, res) => {
  const produto = req.body;

  if (!produto?.nome || !produto?.preco) {
    return res.status(400).json({ erro: { mensagem: 'Campos nome e preco são obrigatórios' } });
  }

  try {
    const resultado = await criaProduto(produto);
    return res.status(201).json(resultado);
  } catch (erro) {
    return res.status(500).json({ erro: { mensagem: `Erro ao criar o produto ${produto.nome}` } });
  }
});

// Atualizar produto
rotasProdutos.patch('/produtos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: { mensagem: 'ID inválido' } });
  }

  try {
    const dados = req.body;
    const resposta = await atualizaProdutosPorId(id, dados);
    if (!resposta) {
      return res.status(404).json({ erro: { mensagem: 'Produto não encontrado' } });
    }
    return res.status(200).json(resposta);
  } catch (erro) {
    return res.status(500).json({ erro: { mensagem: 'Erro ao atualizar produto' } });
  }
});

// Deletar produto
rotasProdutos.delete('/produtos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: { mensagem: 'ID inválido' } });
  }

  try {
    const encontrado = await deletaProdutosPorId(id);
    if (!encontrado) {
      return res.status(404).json({ erro: { mensagem: 'Produto não encontrado' } });
    }
    return res.status(204).send();
  } catch (erro) {
    return res.status(500).json({ erro: { mensagem: 'Erro ao deletar produto' } });
  }
});

// Buscar produto por ID
rotasProdutos.get('/produtos/:id', async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ erro: { mensagem: 'ID inválido' } });
  }

  try {
    const produto = await leProdutosPorId(id);
    if (!produto) {
      return res.status(404).json({ erro: { mensagem: 'Produto não encontrado' } });
    }
    return res.status(200).json(produto);
  } catch (erro) {
    return res.status(500).json({ erro: { mensagem: 'Erro ao buscar produto' } });
  }
});

// Listar todos os produtos
rotasProdutos.get('/produtos', async (req, res) => {
  try {
    const produtos = await leProdutos();
    return res.status(200).json(produtos);
  } catch (erro) {
    return res.status(500).json({ erro: { mensagem: 'Erro ao buscar produtos' } });
  }
});
