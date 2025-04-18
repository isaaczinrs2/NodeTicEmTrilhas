import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './tic.db'
});

sequelize.authenticate();

// Modelo Produto
export const Produto = sequelize.define('produto', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: Sequelize.STRING, allowNull: false, unique: true },
  preco: { type: Sequelize.DOUBLE, allowNull: false }
});

// Modelo Pedido
export const Pedido = sequelize.define('pedido', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  valor_total: { type: Sequelize.DOUBLE, allowNull: false },
  estado: { type: Sequelize.STRING, allowNull: false }
});

// Tabela de Associação Pedido-Produto
export const ProdutosPedido = sequelize.define('produtos_pedido', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  quantidade: { type: Sequelize.INTEGER, allowNull: false },
  preco: { type: Sequelize.DOUBLE, allowNull: false }
});

// Associações
Produto.belongsToMany(Pedido, { through: ProdutosPedido });
Pedido.belongsToMany(Produto, { through: ProdutosPedido });

// Funções de CRUD para Produto
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

export async function leProdutos() {
  try {
    const produtos = await ProdutosPedido.findAll();
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
    if (produto) {
      console.log('Produto consultado com sucesso!', produto);
      return produto;
    } else {
      console.log(`Nenhum produto encontrado com o ID ${id}`);
      return null;
    }
  } catch (erro) {
    console.log('Erro ao encontrar produto', erro);
    throw erro;
  }
}

export async function atualizaProdutosPorId(id, dadosProduto) {
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      console.log(`Nenhum produto encontrado com o ID ${id}`);
      return null;
    }
    await produto.update(dadosProduto);
    console.log('Produto atualizado com sucesso!', produto);
    return produto;
  } catch (erro) {
    console.log('Erro ao atualizar produto', erro);
    throw erro;
  }
}

export async function deletaProdutosPorId(id) {
  try {
    const quantidade = await Produto.destroy({ where: { id } });
    if (quantidade > 0) {
      console.log('Produto deletado com sucesso!');
    } else {
      console.log(`Nenhum produto encontrado com o ID ${id}`);
    }
    return quantidade;
  } catch (erro) {
    console.log('Erro ao deletar produto', erro);
    throw erro;
  }
}

// Funções de CRUD para Pedido
export async function criaPedido(novoPedido) {
  try {
    const pedido = await Pedido.create({
      valor_total: novoPedido.valor_total,
      estado: 'Encaminhado'
    });

    for (const prod of novoPedido.produtos) {
      const produto = await Produto.findByPk(prod.id);
      if (produto) {
        await pedido.addProduto(produto, {
          through: { quantidade: prod.quantidade, preco: prod.preco }
        });
        console.log(`Produto ${produto.id} adicionado ao pedido ${pedido.id}`);
      }
    }

    return pedido;
  } catch (erro) {
    console.log('Erro ao criar pedido', erro);
    throw erro;
  }
}


export async function lePedidos() {
    try {
      const pedidos = await Pedido.findAll({
        include: {
          model: Produto,
          through: {  
            attributes: ['quantidade','preco']
          }
        }
      });
      console.log('Pedidos consultados com sucesso!');
      return pedidos;
    } catch (erro) {
      console.log('Erro ao encontrar pedidos', erro);
      throw erro;
    }
  }
  

export async function lePedidoPorId(id) {
  try {
    const pedido = await Pedido.findByPk(id, { include: Produto });
    if (pedido) {
      console.log('Pedido consultado com sucesso!', pedido);
      return pedido;
    } else {
      console.log(`Nenhum pedido encontrado com o ID ${id}`);
      return null;
    }
  } catch (erro) {
    console.log('Erro ao encontrar pedido', erro);
    throw erro;
  }
}
