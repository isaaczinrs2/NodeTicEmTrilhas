import http from 'http';
import fs from 'fs';
import rotas from './routes.js';
import sqlite3 from 'sqlite3';
import { sequelize, Produto, criaProduto, leProdutos, leProdutosPorId, atualizaProdutosPorId, deletaProdutosPorId } from './models.js';

const db = new sqlite3.Database('./tic.db', (erro) => {
    if (erro) {
        console.log('Erro ao conectar ao banco de dados', erro);
    }
    console.log('Banco de dados conectado com sucesso');
});

fs.writeFileSync('./mensagem.txt', 'Olá, TIC em Trilhas do arquivo!', 'utf-8');

fs.readFile('./mensagem.txt', 'utf-8', (erro, conteudo) => {
    if (erro) {
        console.log('Falha na leitura do arquivo', erro);
        return;
    }
    console.log(`Conteúdo: ${conteudo}`);
    iniciaServidorHttp(conteudo);
});

async function iniciaServidorHttp(conteudo) {
    await sequelize.sync()
        .then(() => {
            console.log('Banco de dados sincronizado com sucesso!');
        })
        .catch((erro) => {
            console.log('Erro ao sincronizar o banco de dados', erro);
        });


        await Produto.findOrCreate({
            where: { nome: 'Acaí Tradicional' },
            defaults: { preco: 10 }
          });
          
          await Produto.findOrCreate({
            where: { nome: 'Acaí com Granola' },
            defaults: { preco: 20 }
          });

          await Produto.findOrCreate({
            where: { nome: 'Acaí Top' },
            defaults: { preco: 10 }
          });
          
          
          

    // Exibe os produtos no terminal
    const produtos = await leProdutos();
        console.log(produtos);

        await leProdutosPorId(1);
        await leProdutosPorId(20);
        await atualizaProdutosPorId(2, { preco: 15 });
        await deletaProdutosPorId(4);

    // Agora sim, novo log atualizado:
    const produtosAtualizados = await leProdutos();
    console.log(produtosAtualizados);


      
    const servidor = http.createServer((req, res) => {
        rotas(req, res, { conteudo });
    });

    const porta = 3002;
    const host = 'localhost';

    servidor.listen(porta, host, () => {
        console.log(`Servidor executado em http://${host}:${porta}/`);
    });
}
