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
        if (!resposta) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ erro: { mensagem: 'Produto não encontrado' } }));
        }
        return res.end(JSON.stringify(resposta));

      } catch (erro) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ erro: { mensagem: 'Erro a atualizar produto' } }));
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
      const encontrado = await deletaProdutosPorId(id);
      res.statusCode = 204;
      
        if (!encontrado) {
            res.statusCode = 404;
        }
        
      return res.end(); // sem corpo
    } catch (erro) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ erro: { mensagem: `Erro ao deletar produto ${id}` } }));
    }
  }
  

    

    // GET /produtos — lista todos **/
    if (req.method === 'GET' && req.url === '/produtos') {
        try {
        const todos = await leProdutos();
        res.statusCode = 200;
        return res.end(JSON.stringify(todos));
        } catch (erro) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ erro: { mensagem: 'Erro ao listar produtos' } }));
        }
    }
    
    // GET /produtos/:id — busca por ID **/
    if (req.method === 'GET' && req.url.startsWith('/produtos/')) {
        const id = parseInt(req.url.split('/')[2], 10);
        if (isNaN(id)) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ erro: { mensagem: 'ID inválido' } }));
        }
    
        try {
        const prod = await leProdutosPorId(id);
        if (!prod) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ erro: { mensagem: 'Produto não encontrado' } }));
        }
        res.statusCode = 200;
        return res.end(JSON.stringify(prod));
        } catch (erro) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ erro: { mensagem: 'Erro ao buscar produto' } }));
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
