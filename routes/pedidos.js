    import express from 'express';
    import { criaPedido, lePedidoPorId, lePedido } from './../models.js';

    export const rotasPedidos = express.Router();

    rotasPedidos.post('/pedidos', async (req, res) => {
        const pedido = req.body;
        
        // Validação melhorada
        if (!pedido?.produtos || !pedido.produtos.length) {
            return res.status(400).json({ erro: { mensagem: "Lista de produtos é obrigatória" } });
        }
        
        for (const produto of pedido.produtos) {
            if (!produto.id || produto.quantidade === undefined) {
                return res.status(400).json({ 
                    erro: { 
                        mensagem: "Cada produto deve ter 'id' e 'quantidade'"
                    } 
                });
            }
        }
        
        if (!pedido.valorTotal || pedido.valorTotal <= 0) {
            return res.status(400).json({ 
                erro: { 
                    mensagem: "valorTotal é obrigatório e deve ser maior que zero"
                } 
            });
        }
        
        try {
            const resposta = await criaPedido(pedido);
            return res.status(201).json(resposta);
        } catch (erro) {
            console.error('Erro detalhado:', erro);
            return res.status(500).json({ 
                erro: { 
                    mensagem: "Erro ao criar pedido",
                    detalhes: erro.message 
                } 
            });
        }
    });
        

    rotasPedidos.get('/pedidos/:id', async (req, res, next) => {
        const id = req.params.id;
        if (isNaN(id)) {
        return res.status(400).json({ erro: { mensagem: 'ID inválido' } });
        }
    
        try {
        const pedido = await lePedidoPorId(id);
        if (!pedido) {
            return res.status(404).json({ erro: { mensagem: 'Pedido não encontrado' } });
        }
        return res.status(200).json(pedido);
        } catch (erro) {
        return res.status(500).json({ erro: { mensagem: 'Erro ao buscar pedido' } });
        }
    });
    
    // Listar todos os pedidos
    rotasPedidos.get('/pedidos', async (req, res) => {
        try {
        const pedidos = await lePedido();
        return res.status(200).json(pedidos);
        } catch (erro) {
        return res.status(500).json({ erro: { mensagem: 'Erro ao buscar pedidos' } });
        }
    });
