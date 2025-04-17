import fs from 'fs';
import {
  criaProduto,
  leProdutos,
  leProdutosPorId,
  atualizaProdutosPorId,
  deletaProdutosPorId
} from './models.js';

export default async function rotas(req, res, dado) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // GET /
  if (req.method === 'GET' && req.url === '/') {
    const { conteudo } = dado;

    res.statusCode = 200;
    return res.end(JSON.stringify({ mensagem: conteudo }));
  }

  // POST /produtos
  if (req.method === 'POST' && req.url === '/produtos') {
    const corpo = [];

    req.on('data', (parte) => corpo.push(parte));

    req.on('end', async () => {
      const corpoCompleto = Buffer.concat(corpo).toString();

      let produto;
      try {
        produto = JSON.parse(corpoCompleto);
      } catch (erro) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ erro: { mensagem: 'JSON inválido' } }));
      }

      if (!produto?.nome || !produto?.preco) {
        res.statusCode = 400;
        return res.end(JSON.stringify({
          erro: { mensagem: 'Os campos nome e preco são obrigatórios' }
        }));
      }

      try {
        const resultado = await criaProduto(produto);
        res.statusCode = 201;
        return res.end(JSON.stringify(resultado));
      } catch (erro) {
        res.statusCode = 500;
        return res.end(JSON.stringify({
          erro: { mensagem: `Erro ao criar o produto ${produto.nome}` }
        }));
      }
    });

    req.on('error', () => {
      res.statusCode = 400;
      return res.end(JSON.stringify({ erro: { mensagem: 'Erro na requisição' } }));
    });

    return;
  }

  // PATCH /produtos/:id
  if (req.method === 'PATCH' && req.url.startsWith('/produtos/')) {
    const id = parseInt(req.url.split('/')[2]);
    if (isNaN(id)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ erro: { mensagem: 'ID inválido' } }));
    }

    const corpo = [];
    req.on('data', (parte) => corpo.push(parte));

    req.on('end', async () => {
      try {
        const dados = JSON.parse(Buffer.concat(corpo).toString());
        const resposta = await atualizaProdutosPorId(id, dados);
        res.statusCode = 200;
        return res.end(JSON.stringify(resposta));
      } catch (erro) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ erro: { mensagem: 'Erro ao atualizar produto' } }));
      }
    });

    return;
  }

  // DELETE /produtos/:id
  if (req.method === 'DELETE' && req.url.startsWith('/produtos/')) {
    const id = parseInt(req.url.split('/')[2]);
    if (isNaN(id)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ erro: { mensagem: 'ID inválido' } }));
    }

    try {
      await deletaProdutosPorId(id);
      res.statusCode = 204;
      return res.end(); // sem corpo
    } catch (erro) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ erro: { mensagem: `Erro ao deletar produto ${id}` } }));
    }
  }
  
    // GET /produtos
    
  if (req.method === 'GET' && req.url.startsWith('/produtos/')) {
    const id = parseInt(req.url.split('/')[2]);
    if (isNaN(id)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ erro: { mensagem: 'ID inválido' } }));
    }

    try {
      await leProdutosPorId(id);
      res.statusCode = 200;
      return res.end(JSON.stringify(resposta)); // sem corpo
    } catch (erro) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ erro: { mensagem: `Erro ao buscar produto ${id}` } }));
    }
  }

  if (req.method === 'GET' && req.url.startsWith('/produtos/')) {
    const id = parseInt(req.url.split('/')[2]);
    if (isNaN(id)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ erro: { mensagem: 'ID inválido' } }));
    }

    try {
      await leProdutos(id);
      res.statusCode = 200;
      return res.end(JSON.stringify(resposta)); // sem corpo
    } catch (erro) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ erro: { mensagem: `Erro ao buscar produtos` } }));
    }
  }

  // Rota não encontrada
  res.statusCode = 404;
  res.end(JSON.stringify({
    erro: {
      mensagem: 'Rota não encontrada',
      url: req.url
    }
  }));

  
}
