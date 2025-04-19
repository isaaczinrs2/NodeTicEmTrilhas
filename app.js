import sqlite3 from 'sqlite3';
import express from 'express';
import bodyParser from 'body-parser';  
import { sequelize } from './models.js';
import { rotasProdutos } from './routes/produtos.js';
import { rotasPedidos } from './routes/pedidos.js';

const app = express();

app.use(bodyParser.json());


app.use(rotasProdutos);
app.use(rotasPedidos);

async function inicializaApp() {

    const db = new sqlite3.Database('./tic.db', (erro) => {

        if (erro) {
            console.log('Erro ao conectar ao banco de dados', erro);
        }
        console.log('Banco de dados conectado com sucesso');
    });

    await sequelize.sync()
        .then(() => {
            console.log('Banco de dados sincronizado com sucesso!');
        })
        .catch((erro) => {
            console.log('Erro ao sincronizar o banco de dados', erro);
        });

    const porta = 3002;
    
    app.listen(porta , () => {
        console.log(`Servidor rodando na porta ${porta}`);
    });

  
}

inicializaApp();