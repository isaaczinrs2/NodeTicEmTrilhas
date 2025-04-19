import sqlite3 from 'sqlite3';
import express from 'express';
import bodyParser from 'body-parser';  


import { sequelize } from './models.js';

const app = express();

app.use(bodyParser.json());


app.use('/produtos', (req, res, next ) => {
    console.log(`Rota /produtos`);
    res.send();
});

app.use((req, res, next ) => {
    console.log(`Problema resolvido`);
    res.send({
        mensagem: 'Problema resolvido'
    });
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