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
        allowNull: false,
        unique: true
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

export async function leProdutosPorId(id) {
    try {
        const produto = await Produto.findByPk(id);
        if (produto) {
            console.log('Produto encontrado com sucesso!');
            console.log(produto); 
        } else {
            console.log(`Nenhum produto encontrado com o ID ${id}`);
        }
        return produto;
    } catch (erro) {
        console.log('Erro ao encontrar produto', erro);
    }
}

export async function atualizaProdutosPorId(id, dadosProduto) {
    try {
        const produto = await Produto.update(dadosProduto, {where: { id:id } });
        if (produto) {
            console.log('Produto atualizado com sucesso!');
            console.log(produto); 
        } else {
            console.log(`Nenhum produto encontrado com o ID ${id}`);
        }
        return produto;
    } catch (erro) {
        console.log('Erro ao atualizar produto', erro);
    }
}

export async function deletaProdutosPorId(id, ) {
    try {
        const produto = await Produto.destroy( {where: { id:id } });
        if (produto) {
            console.log('Produto deletado com sucesso!');
            console.log(produto); 
        } else {
            console.log(`Nenhum produto encontrado com o ID ${id}`);
        }
        return produto;
    } catch (erro) {
        console.log('Erro ao deletar produto', erro);
    }
}