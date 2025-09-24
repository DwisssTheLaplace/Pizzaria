"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs_1 = require("fs");
var readline = require("readline");
var process_1 = require("process");
// Configuração da interface para o usuário poder utilizar o terminal.
var rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
function ask(q) {
    return new Promise(function (resolve) { return rl.question(q, resolve); });
}
// Define o caminho para o diretório que armazenará os dados
var pastaDB = path.resolve(__dirname, 'Banco de Dados');
// Define os caminhos completos para os arquivos de dados CSV
var cardapioPath = path.resolve(pastaDB, 'cardapio.csv');
var pedidosPath = path.resolve(pastaDB, 'pedidos.csv');
// ==========================================================================
// ----------- FUNÇÕES DE ACESSO E REGISTRO AO CARDÁPIO (CSV) -----------------
// ============================================================================
// Converte o array do cardápio para uma string CSV e salva no arquivo.
function salvarCardapio(cardapio) {
    return __awaiter(this, void 0, void 0, function () {
        var header, linhas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    header = 'id,nome,descricao,preco,categoria,disponivel\n';
                    linhas = cardapio.map(function (item) {
                        return "".concat(item.id, ",\"").concat(item.nome, "\",\"").concat(item.descricao.replace(/"/g, '""'), "\",").concat(item.preco, ",\"").concat(item.categoria, "\",").concat(item.disponivel);
                    }).join('\n');
                    return [4 /*yield*/, fs_1.promises.writeFile(cardapioPath, header + linhas, 'utf-8')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Interpreta o arquivo CSV de cardápio caso exista e converte em um array
function carregarCardapio() {
    return __awaiter(this, void 0, void 0, function () {
        var dadosDoArquivo, linhas, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readFile(cardapioPath, 'utf-8')];
                case 1:
                    dadosDoArquivo = _a.sent();
                    linhas = dadosDoArquivo.trim().split('\n').slice(1);
                    if (linhas.length === 0)
                        return [2 /*return*/, []];
                    return [2 /*return*/, linhas.map(function (linha) {
                            // Expressão regular para separar colunas, lidando com texto entre aspas
                            var colunas = linha.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
                            return {
                                id: Number(colunas[0]), nome: colunas[1].replace(/"/g, ''), descricao: colunas[2].replace(/"/g, ''),
                                preco: Number(colunas[3]), categoria: colunas[4].replace(/"/g, ''), disponivel: colunas[5] === 'true'
                            };
                        })];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, []]; // Retorna um array vazio se o arquivo não existir
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Função para CADASTRAR um item ao cardapio
function cadastrarItem() {
    return __awaiter(this, void 0, void 0, function () {
        var nome, descricao, preco, _a, categoria, categoriaValida, opcaoCategoria, cardapio, maxId, novoItem;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("\n--- Cadastro de Item no Cardápio ---");
                    return [4 /*yield*/, ask("Insira o nome do item: ")];
                case 1:
                    nome = _b.sent();
                    return [4 /*yield*/, ask("Insira a descrição do item: ")];
                case 2:
                    descricao = _b.sent();
                    _a = Number;
                    return [4 /*yield*/, ask("Insira o valor do item: ")];
                case 3:
                    preco = _a.apply(void 0, [_b.sent()]);
                    categoria = 'Outros';
                    categoriaValida = false;
                    _b.label = 4;
                case 4:
                    if (!!categoriaValida) return [3 /*break*/, 6];
                    console.log("\nSelecione a categoria do item:");
                    console.log("1. Pizza");
                    console.log("2. Bebida");
                    console.log("3. Sobremesa");
                    console.log("4. Outros");
                    return [4 /*yield*/, ask("Opção: ")];
                case 5:
                    opcaoCategoria = _b.sent();
                    switch (opcaoCategoria) {
                        case '1':
                            categoria = 'Pizza';
                            categoriaValida = true;
                            break;
                        case '2':
                            categoria = 'Bebida';
                            categoriaValida = true;
                            break;
                        case '3':
                            categoria = 'Sobremesa';
                            categoriaValida = true;
                            break;
                        case '4':
                            categoria = 'Outros';
                            categoriaValida = true;
                            break;
                        default: console.log("Opção de categoria inválida. Tente novamente.");
                    }
                    return [3 /*break*/, 4];
                case 6: return [4 /*yield*/, carregarCardapio()];
                case 7:
                    cardapio = _b.sent();
                    maxId = cardapio.reduce(function (max, item) { return item.id > max ? item.id : max; }, 0);
                    novoItem = { id: maxId + 1, nome: nome, descricao: descricao, preco: preco, categoria: categoria, disponivel: true };
                    cardapio.push(novoItem);
                    return [4 /*yield*/, salvarCardapio(cardapio)];
                case 8:
                    _b.sent(); // puxa a constante novoItem para o array cardapio
                    console.log("\nItem \"".concat(novoItem.nome, "\" cadastrado com sucesso!"));
                    return [2 /*return*/];
            }
        });
    });
}
// Mostra o cardapio caso já exista
function exibirCardapio() {
    return __awaiter(this, void 0, void 0, function () {
        var cardapio;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n--- Cardapio Disponível ---");
                    return [4 /*yield*/, carregarCardapio()];
                case 1:
                    cardapio = _a.sent();
                    if (cardapio.length === 0) {
                        console.log("Nenhum item cadastrado no cardapio.");
                        return [2 /*return*/];
                    }
                    cardapio.forEach(function (item) {
                        var precoFormatado = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // Formata o preço
                        console.log("".concat(item.id, ". ").concat(item.nome, " - ").concat(precoFormatado, " [").concat(item.categoria, "]"));
                        console.log("   Descri\u00E7\u00E3o: ".concat(item.descricao));
                        console.log('---------------------------');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// =================================================================
// ----------- FUNÇÕES DE GERENCIAMENTO DE PEDIDOS (CSV) -----------
// =================================================================
// Converte o array de pedidos para uma string CSV e salva no arquivo
function salvarPedidos(pedidos) {
    return __awaiter(this, void 0, void 0, function () {
        var header, linhas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    header = 'id,nomeCliente,itens,total,status,data\n';
                    linhas = pedidos.map(function (pedido) {
                        var itensString = pedido.itens.map(function (ip) { return "".concat(ip.item.id, ":").concat(ip.quantidade); }).join(';'); // ip = item do pedido
                        return "".concat(pedido.id, ",\"").concat(pedido.nomeCliente, "\",\"").concat(itensString, "\",").concat(pedido.total, ",").concat(pedido.status, ",").concat(pedido.data);
                    }).join('\n');
                    return [4 /*yield*/, fs_1.promises.writeFile(pedidosPath, header + linhas, 'utf-8')];
                case 1:
                    _a.sent(); // Salva o arquivo em formato CSV com o cabeçalho
                    return [2 /*return*/];
            }
        });
    });
}
// Lê o arquivo CSV de pedidos e o converte em um array de objetos
function carregarPedidos() {
    return __awaiter(this, void 0, void 0, function () {
        var cardapio, dadosDoArquivo, linhas, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, carregarCardapio()];
                case 1:
                    cardapio = _a.sent();
                    if (cardapio.length === 0)
                        return [2 /*return*/, []]; // Caso não exista antes, carrega um array vazio
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fs_1.promises.readFile(pedidosPath, 'utf-8')];
                case 3:
                    dadosDoArquivo = _a.sent();
                    linhas = dadosDoArquivo.trim().split('\n').slice(1);
                    if (linhas.length === 0)
                        return [2 /*return*/, []];
                    return [2 /*return*/, linhas.map(function (linha) {
                            var colunas = linha.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || []; // uma regex (expressão regular) para separar as colunas
                            var itensString = colunas[2].replace(/"/g, ''); // outra regex para limpar as aspas em caso de mais de um item
                            var itens = itensString.split(';').map(function (par) {
                                var _a = par.split(':'), itemId = _a[0], quantidade = _a[1];
                                var itemDoCardapio = cardapio.find(function (c) { return c.id === Number(itemId); });
                                return { item: itemDoCardapio, quantidade: Number(quantidade) };
                            }).filter(function (ip) { return ip.item; });
                            return {
                                id: Number(colunas[0]), nomeCliente: colunas[1].replace(/"/g, ''), itens: itens,
                                total: Number(colunas[3]), status: colunas[4], data: colunas[5]
                            };
                        })];
                case 4:
                    error_2 = _a.sent();
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// =================================================================
// -------------   FUNÇÃO DE CADASTRO DE PEDIDO  -------------------
// =================================================================
// Função para cadastrar um pedido, calcular o total e salvar o registro
function cadastrarPedido() {
    return __awaiter(this, void 0, void 0, function () {
        var cardapio, nomeCliente, itensPedido, continuarPedindo, _loop_1, total, todosPedidos, maxId, novoPedido;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n--- Cadastro de Pedido ---");
                    return [4 /*yield*/, exibirCardapio()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, carregarCardapio()];
                case 2:
                    cardapio = _a.sent();
                    if (cardapio.length === 0) {
                        console.log("Não é possível registrar pedidos pois o cardapio está vazio.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ask("Digite o nome do cliente: ")];
                case 3:
                    nomeCliente = _a.sent();
                    itensPedido = [];
                    continuarPedindo = true;
                    _loop_1 = function () {
                        var idPedido, id, itemEncontrado, qtPedido, quantidade;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, ask("\nDigite o ID do item que deseja adicionar (ou 'fim' para encerrar): ")];
                                case 1:
                                    idPedido = _b.sent();
                                    if (idPedido.toLowerCase() === 'fim') {
                                        continuarPedindo = false;
                                        return [2 /*return*/, "continue"];
                                    }
                                    id = Number(idPedido);
                                    itemEncontrado = cardapio.find(function (item) { return item.id === id; });
                                    if (!itemEncontrado) return [3 /*break*/, 3];
                                    return [4 /*yield*/, ask("Quantas unidades de \"".concat(itemEncontrado.nome, "\" voc\u00EA deseja? "))];
                                case 2:
                                    qtPedido = _b.sent();
                                    quantidade = Number(qtPedido);
                                    if (quantidade > 0) {
                                        itensPedido.push({ item: itemEncontrado, quantidade: quantidade });
                                        console.log("".concat(quantidade, "x \"").concat(itemEncontrado.nome, "\" adicionado(s) ao pedido."));
                                    }
                                    else {
                                        console.log("Quantidade inválida. O item não foi adicionado.");
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    console.log("ID de item não encontrado. Tente novamente.");
                                    _b.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 4;
                case 4:
                    if (!continuarPedindo) return [3 /*break*/, 6];
                    return [5 /*yield**/, _loop_1()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 6:
                    if (itensPedido.length === 0) {
                        console.log("\nNenhum item foi adicionado. Pedido cancelado.");
                        return [2 /*return*/];
                    }
                    total = itensPedido.reduce(function (soma, itemPedido) { return soma + (itemPedido.item.preco * itemPedido.quantidade); }, 0);
                    return [4 /*yield*/, carregarPedidos()];
                case 7:
                    todosPedidos = _a.sent();
                    maxId = todosPedidos.reduce(function (max, pedido) { return pedido.id > max ? pedido.id : max; }, 0);
                    novoPedido = {
                        id: maxId + 1,
                        nomeCliente: nomeCliente,
                        itens: itensPedido,
                        total: total,
                        status: 'Recebido', data: new Date().toISOString()
                    };
                    // Salva o novo pedido no arquivo CSV
                    todosPedidos.push(novoPedido);
                    return [4 /*yield*/, salvarPedidos(todosPedidos)];
                case 8:
                    _a.sent();
                    console.log("\n--- Pedido Registrado com Sucesso! ---");
                    console.log("Cliente: ".concat(novoPedido.nomeCliente));
                    console.log("Itens:");
                    novoPedido.itens.forEach(function (ip) { console.log("  - ".concat(ip.quantidade, "x ").concat(ip.item.nome)); });
                    console.log("Total do Pedido: ".concat(novoPedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })));
                    console.log("---------------------------------------");
                    return [2 /*return*/];
            }
        });
    });
}
// =================================================================
// -----------    FUNÇÃO DE CONSULTA DE PEDIDO --------------------
// =================================================================
// Função para consultar um pedido não concluído pelo ID e exibir seus detalhes
function consultarPedido() {
    return __awaiter(this, void 0, void 0, function () {
        var todosPedidos, pedidosNaoConcluidos, idPedido, id, pedido;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, carregarPedidos()];
                case 1:
                    todosPedidos = _a.sent();
                    pedidosNaoConcluidos = todosPedidos.filter(function (p) { return p.status !== 'Concluído'; });
                    if (pedidosNaoConcluidos.length === 0) {
                        console.log("\nNão há pedidos ativos (não concluídos) no momento.");
                        return [2 /*return*/];
                    }
                    // exibe IDs de pedidos não concluídos
                    console.log("\n--- Pedidos Ativos (Não Concluídos) ---");
                    pedidosNaoConcluidos.forEach(function (pedido) {
                        console.log("ID: ".concat(pedido.id, " | Cliente: ").concat(pedido.nomeCliente, " | Status: ").concat(pedido.status));
                    });
                    console.log("---------------------------------------");
                    return [4 /*yield*/, ask("Digite o ID do pedido que deseja consultar em detalhes: ")];
                case 2:
                    idPedido = _a.sent();
                    id = Number(idPedido);
                    pedido = todosPedidos.find(function (p) { return p.id === id; });
                    if (!pedido) {
                        console.log("Pedido não encontrado.");
                        return [2 /*return*/];
                    }
                    console.log("\n--- Detalhes do Pedido ---");
                    console.log("ID: ".concat(pedido.id));
                    console.log("Cliente: ".concat(pedido.nomeCliente));
                    console.log("Data: ".concat(new Date(pedido.data).toLocaleString('pt-BR')));
                    console.log("Status: ".concat(pedido.status));
                    console.log("Itens:");
                    pedido.itens.forEach(function (ip) {
                        console.log("  - ".concat(ip.quantidade, "x ").concat(ip.item.nome));
                    });
                    console.log("Total: ".concat(pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })));
                    console.log("--------------------------");
                    return [2 /*return*/];
            }
        });
    });
}
// ========================================================================
// ----------------- FUNÇÕES DE GERENCIAMENTO DE PEDIDO -------------------
// ========================================================================
// Função para excluir um pedido pelo ID
function excluirPedido() {
    return __awaiter(this, void 0, void 0, function () {
        var idPedido, id, pedidos, pedidoIndex, confirmacao;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ask("Digite o ID do pedido que deseja excluir: ")];
                case 1:
                    idPedido = _a.sent();
                    id = Number(idPedido);
                    return [4 /*yield*/, carregarPedidos()];
                case 2:
                    pedidos = _a.sent();
                    pedidoIndex = pedidos.findIndex(function (p) { return p.id === id; });
                    if (pedidoIndex === -1) {
                        console.log("Pedido não encontrado.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ask("Tem certeza que deseja excluir o pedido ".concat(id, " do cliente ").concat(pedidos[pedidoIndex].nomeCliente, "? (s/n): "))];
                case 3:
                    confirmacao = _a.sent();
                    if (!(confirmacao.toLowerCase() === 's')) return [3 /*break*/, 5];
                    pedidos.splice(pedidoIndex, 1);
                    return [4 /*yield*/, salvarPedidos(pedidos)];
                case 4:
                    _a.sent();
                    console.log("Pedido excluído com sucesso.");
                    return [3 /*break*/, 6];
                case 5:
                    console.log("Exclusão cancelada.");
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Função de atualizar os status de um pedido
function atualizarStatusPedido() {
    return __awaiter(this, void 0, void 0, function () {
        var idPedido, id, pedidos, pedido, opcao, novoStatus;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ask("Digite o ID do pedido para atualizar o status: ")];
                case 1:
                    idPedido = _a.sent();
                    id = Number(idPedido);
                    return [4 /*yield*/, carregarPedidos()];
                case 2:
                    pedidos = _a.sent();
                    pedido = pedidos.find(function (p) { return p.id === id; });
                    if (!pedido) {
                        console.log("Pedido não encontrado.");
                        return [2 /*return*/];
                    }
                    console.log("Status atual do pedido ".concat(id, ": ").concat(pedido.status));
                    console.log("Escolha o novo status:");
                    console.log("1. Em preparação");
                    console.log("2. Sendo Entregue");
                    console.log("3. Concluído");
                    return [4 /*yield*/, ask("Opção: ")];
                case 3:
                    opcao = _a.sent();
                    switch (opcao) {
                        case '1':
                            novoStatus = 'Em preparação';
                            break;
                        case '2':
                            novoStatus = 'Sendo Entregue';
                            break;
                        case '3':
                            novoStatus = 'Concluído';
                            break;
                        default:
                            console.log("Opção inválida.");
                            return [2 /*return*/];
                    }
                    pedido.status = novoStatus;
                    return [4 /*yield*/, salvarPedidos(pedidos)];
                case 4:
                    _a.sent();
                    console.log("Status do pedido ".concat(id, " atualizado para \"").concat(novoStatus, "\"."));
                    if (novoStatus === 'Concluído') {
                        Recibo(pedido);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// =================================================================
// -----------  FUNÇÕES DE RELATÓRIOS E RECIBOS --------------------
// =================================================================
// Função para gerar um recibo
function Recibo(pedido) {
    console.log("\n\n==================== RECIBO ====================");
    console.log("Pedido ID: ".concat(pedido.id));
    console.log("Cliente: ".concat(pedido.nomeCliente));
    console.log("Data: ".concat(new Date(pedido.data).toLocaleString('pt-BR')));
    console.log("----------------------------------------------");
    console.log("Qtd.  Item".padEnd(30) + "Preço Unit.".padEnd(15) + "Subtotal");
    pedido.itens.forEach(function (itemPedido) {
        var nomeItem = "".concat(itemPedido.quantidade, "x    ").concat(itemPedido.item.nome).padEnd(30);
        var precoUnit = itemPedido.item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).padEnd(15);
        var subtotal = (itemPedido.item.preco * itemPedido.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        console.log(nomeItem + precoUnit + subtotal);
    });
    console.log("----------------------------------------------");
    var totalFormatado = "TOTAL: ".concat(pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    console.log(totalFormatado.padStart(50));
    console.log("==============================================\n\n");
}
// Função para gerar relatório diário/mensal de vendas de pizza
function Relatorio() {
    return __awaiter(this, void 0, void 0, function () {
        var pedidos, hoje, inicioDoMes, pizzasVendidasHoje, pizzasVendidasMes, _i, pedidos_1, pedido, dataPedido, _a, _b, itemPedido, _c, _d, itemPedido;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, carregarPedidos()];
                case 1:
                    pedidos = _e.sent();
                    if (pedidos.length === 0) {
                        console.log("Nenhum pedido registrado para gerar relatórios.");
                        return [2 /*return*/];
                    }
                    hoje = new Date();
                    inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    pizzasVendidasHoje = 0;
                    pizzasVendidasMes = 0;
                    for (_i = 0, pedidos_1 = pedidos; _i < pedidos_1.length; _i++) {
                        pedido = pedidos_1[_i];
                        dataPedido = new Date(pedido.data);
                        if (dataPedido.toDateString() === hoje.toDateString()) {
                            for (_a = 0, _b = pedido.itens; _a < _b.length; _a++) {
                                itemPedido = _b[_a];
                                if (itemPedido.item.categoria === 'Pizza') {
                                    pizzasVendidasHoje += itemPedido.quantidade;
                                }
                            }
                        }
                        if (dataPedido >= inicioDoMes) {
                            for (_c = 0, _d = pedido.itens; _c < _d.length; _c++) {
                                itemPedido = _d[_c];
                                if (itemPedido.item.categoria === 'Pizza') {
                                    pizzasVendidasMes += itemPedido.quantidade;
                                }
                            }
                        }
                    }
                    console.log("\n--- Relatório de Vendas de Pizzas ---");
                    console.log("Pizzas vendidas hoje: ".concat(pizzasVendidasHoje));
                    console.log("Pizzas vendidas no m\u00EAs: ".concat(pizzasVendidasMes));
                    console.log("-------------------------------------");
                    return [2 /*return*/];
            }
        });
    });
}
// =================================================================
// -----------. FUNÇÃO PRINCIPAL E INICIALIZAÇÃO .------------------
// =================================================================
// Garante que o diretório para armazenamento de dados exista.
function pastaExiste() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.mkdir(pastaDB, { recursive: true })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Erro ao criar o diretório do banco de dados:", error_3);
                    process.exit(1); // Encerra o programa se não for possível criar o diretório.
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// -------- Menu ----------
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var executando, opcao, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, pastaExiste()];
                case 1:
                    _b.sent();
                    executando = true;
                    _b.label = 2;
                case 2:
                    if (!executando) return [3 /*break*/, 21];
                    console.log("\n===== SISTEMA DE PEDIDOS =====");
                    console.log("1. Cadastrar novo item no cardápio");
                    console.log("2. Cardápio");
                    console.log("3. Registrar novo pedido");
                    console.log("4. Consultar pedido");
                    console.log("5. Atualizar status de um pedido");
                    console.log("6. Excluir pedido");
                    console.log("7. Relatório");
                    console.log("8. Sair");
                    return [4 /*yield*/, ask("Escolha uma opção: ")];
                case 3:
                    opcao = _b.sent();
                    _a = opcao;
                    switch (_a) {
                        case '1': return [3 /*break*/, 4];
                        case '2': return [3 /*break*/, 6];
                        case '3': return [3 /*break*/, 8];
                        case '4': return [3 /*break*/, 10];
                        case '5': return [3 /*break*/, 12];
                        case '6': return [3 /*break*/, 14];
                        case '7': return [3 /*break*/, 16];
                        case '8': return [3 /*break*/, 18];
                    }
                    return [3 /*break*/, 19];
                case 4: return [4 /*yield*/, cadastrarItem()];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 6: return [4 /*yield*/, exibirCardapio()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 8: return [4 /*yield*/, cadastrarPedido()];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 10: return [4 /*yield*/, consultarPedido()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 12: return [4 /*yield*/, atualizarStatusPedido()];
                case 13:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 14: return [4 /*yield*/, excluirPedido()];
                case 15:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 16: return [4 /*yield*/, Relatorio()];
                case 17:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 18:
                    executando = false;
                    return [3 /*break*/, 20];
                case 19:
                    console.log("Opção inválida, tente novamente.");
                    _b.label = 20;
                case 20: return [3 /*break*/, 2];
                case 21:
                    rl.close();
                    return [2 /*return*/];
            }
        });
    });
}
main();
