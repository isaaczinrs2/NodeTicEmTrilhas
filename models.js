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
        try {
            const resultado = await Produto.create(produto);
            console.log(`O produto ${resultado.nome} foi criado com sucesso!`);
            return resultado;
        } catch (erro) {
            console.log('Erro ao criar produto', erro);
            throw erro;
        }
    }
    

export async function leProdutos(){
    try {
        const produtos = await Produto.findAll();
        console.log('Produtos consultados com sucesso!');
        return produtos;
    } catch (erro) {
        console.log('Erro ao encontrar produtos', erro);
        throw erro;
    }
}

export async function leProdutosPorId(id) {
    try {
        const produto = await Produto.findByPk(id);
       conosole.log(`Produto consultado com sucesso!, resultado`);
       return resultado;
        
    } catch (erro) {
        console.log('Erro ao encontrar produto', erro);
        throw erro;
    }
}


export async function atualizaProdutosPorId(id, dadosProduto) {
    try {
        const resultado = await Produto.update(dadosProduto, {where: { id:id } });
        if (produto) {
            console.log('Produto atualizado com sucesso!', resultado);
            return resultado;
        } else {
            console.log(`Nenhum produto encontrado com o ID ${id}`);
        }
        return produto;
    } catch (erro) {
        console.log('Erro ao atualizar produto', erro);
        throw erro;
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
        throw erro;
    }
}