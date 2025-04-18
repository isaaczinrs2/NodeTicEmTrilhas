import http from 'http';
import fs from 'fs';
import rotas from './routes.js';
import sqlite3 from 'sqlite3';
import { sequelize, criaPedido, lePedidos } from './models.js';

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

        await criaPedido({
            valor_total: 100.00,
            produtos: [
              { id: 3, quantidade: 3, preco: 9.5 },
              { id: 1, quantidade: 2, preco: 8.0 }
            ]
          });
          
          
          const pedidos = await lePedidos();
          console.log(JSON.stringify(pedidos, null, 2));
    
    const servidor = http.createServer((req, res) => {
        rotas(req, res, { conteudo });
    });

    const porta = 3002;
    const host = 'localhost';

    servidor.listen(porta, host, () => {
        console.log(`Servidor executado em http://${host}:${porta}/`);
    });
}
