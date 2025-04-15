import fs from 'fs';

export default function rotas(req, res, dado) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'GET' && req.url === '/') {
        const { conteudo } = dado;

        res.statusCode = 200;
        const resposta = {
            mensagem: conteudo
        };

        res.end(JSON.stringify(resposta));
        return;
    }

    if (req.method === 'PUT' && req.url === '/arquivos') {
        const corpo = [];

        req.on('data', (parte) => corpo.push(parte));

        req.on('end', () => {
            const corpoCompleto = Buffer.concat(corpo).toString();

            let arquivo;
            try {
                arquivo = JSON.parse(corpoCompleto);
            } catch (erro) {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                    erro: { mensagem: 'JSON inválido' }
                }));
            }

            if (!arquivo?.nome) {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                    erro: { mensagem: 'O campo nome é obrigatório' }
                }));
            }

            fs.writeFile(`${arquivo.nome}.txt`, arquivo?.conteudo ?? '', 'utf-8', (erro) => {
                if (erro) {
                    res.statusCode = 500;
                    return res.end(JSON.stringify({
                        erro: { mensagem: `Erro ao criar o arquivo ${arquivo.nome}` }
                    }));
                }

                res.statusCode = 201;
                return res.end(JSON.stringify({
                    mensagem: `Arquivo ${arquivo.nome} criado com sucesso`
                }));
            });
        });

        req.on('error', (erro) => {
            res.statusCode = 400;
            return res.end(JSON.stringify({
                erro: { mensagem: 'Erro na requisição' }
            }));
        });

        return;
    }

    if (req.method === 'PATCH' && req.url === '/arquivos') {
        const corpo = [];
        req.on('data', (parte) => corpo.push(parte));

        req.on('end', () => {
            const dados = JSON.parse(Buffer.concat(corpo).toString());

            if (!dados?.nome) {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                    erro: { mensagem: "O campo 'nome' é obrigatório para atualizar o arquivo." }
                }));
            }

            fs.writeFile(`${dados.nome}.txt`, dados?.conteudo ?? '', 'utf-8', (erro) => {
                if (erro) {
                    res.statusCode = 500;
                    return res.end(JSON.stringify({
                        erro: { mensagem: `Erro ao atualizar o arquivo ${dados.nome}` }
                    }));
                }

                res.statusCode = 200;
                res.end(JSON.stringify({
                    mensagem: `Arquivo ${dados.nome} atualizado com sucesso!`
                }));
            });
        });

        return;
    }

    if (req.method === 'DELETE' && req.url === '/arquivos') {
        const corpo = [];
        req.on('data', (parte) => corpo.push(parte));

        req.on('end', () => {
            const dados = JSON.parse(Buffer.concat(corpo).toString());

            if (!dados?.nome) {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                    erro: { mensagem: "O campo 'nome' é obrigatório para deletar o arquivo." }
                }));
            }

            fs.unlink(`${dados.nome}.txt`, (erro) => {
                if (erro) {
                    res.statusCode = 500;
                    return res.end(JSON.stringify({
                        erro: { mensagem: `Erro ao deletar o arquivo ${dados.nome}` }
                    }));
                }

                res.statusCode = 200;
                res.end(JSON.stringify({
                    mensagem: `Arquivo ${dados.nome} removido com sucesso!`
                }));
            });
        });

        return;
    }

    // Agora sim, só entra aqui se nenhuma rota foi atendida
    res.statusCode = 404;
    res.end(JSON.stringify({
        erro: {
            mensagem: 'Rota não encontrada',
            url: req.url
        }
    }));
}
