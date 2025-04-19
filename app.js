import sqlite3 from 'sqlite3';
import express from 'express';


import { sequelize } from './models.js';

const app = express();

app.use((req, res, next ) => {
    console.log(`Digite 9 para falar com o atendente`);
    next();
});

app.use((req, res, next ) => {
    console.log(`Problema resolvido`);
    res.send({
        mensagem: 'Problema resolvido'
    });
});

app.use((req, res, next ) => {
    console.log(`Segue o link para baixar o driver atualizado`);
}); 

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
    
    app.listen(porta);

  
}

inicializaApp();