import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage : './tic.db'
});

sequelize.authenticate();

export const Produto = sequelize.define('produto', {
    id: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

export async function criaProduto(produto) {
    return await Produto.create(produto)
        .then(() => {
            console.log('Produto criado com sucesso!');
        })
        .catch((erro) => {
            console.log('Erro ao criar produto', erro);
        });
}

export async function leProdutos(){
    return await Produto.findAll()
        .then((produtos) => {
            console.log('Produtos encontrados com sucesso!');
            return produtos;
        })
        .catch((erro) => {
            console.log('Erro ao encontrar produtos', erro);
        });
}