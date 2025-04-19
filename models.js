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
  const transaction = await sequelize.transaction();
  try {
      // Cria o pedido
      const pedido = await Pedido.create({
          valor_total: novoPedido.valorTotal,
          estado: 'Encaminhado'
      }, { transaction });

      // Processa cada produto
      for (const prod of novoPedido.produtos) {
          const produto = await Produto.findByPk(prod.id, { transaction });
          if (!produto) {
              throw new Error(`Produto com ID ${prod.id} não encontrado`);
          }
          
          // Usa o preço do produto do banco de dados se não foi fornecido
          const preco = produto.preco;
          
          await pedido.addProduto(produto, {
              through: { 
                  quantidade: prod.quantidade,
                  preco: preco
              },
              transaction
          });
      }

      await transaction.commit();
      return pedido;
  } catch (erro) {
      await transaction.rollback();
      console.error('Erro na criação do pedido:', erro);
      throw erro;
  }
}



export async function lePedido() {
  try {
      const pedidos = await Pedido.findAll({
          include: {
              model: Produto,
              through: {
                  attributes: ['quantidade', 'preco']
              }
          },
          raw: true,  
          nest: true  
      });
      
      console.log('Pedidos consultados:', JSON.stringify(pedidos, null, 2));
      return pedidos;
  } catch (erro) {
      console.error('Erro detalhado:', erro);
      throw erro;
  }
}
  

export async function lePedidoPorId(id) {
  try {
      const pedido = await Pedido.findByPk(id, {
          include: {
              model: Produto,
              through: {
                  attributes: ['quantidade', 'preco']
              }
          }
      });
      
      if (!pedido) {
          console.log(`Pedido ${id} não encontrado`);
          return null;
      }
      
    
      const resultado = pedido.get({ plain: true });
      console.log('Pedido encontrado:', resultado);
      return resultado;
  } catch (erro) {
      console.error('Erro detalhado:', erro);
      throw erro;
  }
}
