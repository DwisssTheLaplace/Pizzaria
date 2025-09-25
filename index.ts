import * as path from 'path';
import { promises as fs } from 'fs';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

// Configuração da interface para o usuário poder utilizar o terminal.
const rl = readline.createInterface({ input, output });

function ask(q: string): Promise<string> {
  return new Promise<string>((resolve) => rl.question(q, resolve));
}

// =================================================================
// --------- ESTRUTURAS E ARQUIVOS DE DADOS ---------------------
// =================================================================

// Tipos para as categorias dos itens no cardápio.
type CategoriaItem = 'Pizza' | 'Bebida' | 'Sobremesa' | 'Outros';

// Tipos para os itens do cardápio.
type ItemCardapio = {
    id : number;
    nome: string;
    descricao: string;
    preco: number;
    categoria: CategoriaItem;
    disponivel: boolean;
}

// Tipo para a formação dos itens de um pedido
type ItemPedido = {
  item: ItemCardapio;
  quantidade: number;
}

// Tipo para os status de um pedido
type StatusPedido = 'Recebido' | 'Em preparação' | 'Sendo Entregue' | 'Concluído';

// Tipo para formar um pedido completo
type Pedido = {
  id: number;
  nomeCliente: string;
  itens: ItemPedido[];
  total: number;
  status: StatusPedido;
  data: string;
}

// Define o caminho para o diretório que armazenará os dados
const pastaDB = path.resolve(__dirname, 'Banco de Dados');
// Define os caminhos completos para os arquivos de dados CSV
const cardapioPath = path.resolve(pastaDB, 'cardapio.csv');
const pedidosPath = path.resolve(pastaDB, 'pedidos.csv');

// ==========================================================================
// ----------- FUNÇÕES DE ACESSO E REGISTRO AO CARDÁPIO (CSV) -----------------
// ============================================================================

// Converte o array do cardápio para uma string CSV e salva no arquivo.
async function salvarCardapio(cardapio: ItemCardapio[]): Promise<void> {
    const header = 'id,nome,descricao,preco,categoria,disponivel\n';
    const linhas = cardapio.map(item => 
      `${item.id},"${item.nome}","${item.descricao.replace(/"/g, '""')}",${item.preco},"${item.categoria}",${item.disponivel}`
    ).join('\n');
    await fs.writeFile(cardapioPath, header + linhas, 'utf-8');
}

// Interpreta o arquivo CSV de cardápio caso exista e converte em um array
async function carregarCardapio(): Promise<ItemCardapio[]> {
  try {
    const dadosDoArquivo = await fs.readFile(cardapioPath, 'utf-8');
    const linhas = dadosDoArquivo.trim().split('\n').slice(1); // Ignora o cabeçalho
    if (linhas.length === 0) return [];

    return linhas.map(linha => {
      // Expressão regular para separar colunas, lidando com texto entre aspas
      const colunas = linha.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      return {
        id: Number(colunas[0]), nome: colunas[1].replace(/"/g, ''), descricao: colunas[2].replace(/"/g, ''),
        preco: Number(colunas[3]), categoria: colunas[4].replace(/"/g, '') as CategoriaItem, disponivel: colunas[5] === 'true'
      };
    });
  } catch (error) {
    return []; // Retorna um array vazio se o arquivo não existir
  }
}

// Função para CADASTRAR um item ao cardapio
async function cadastrarItem(): Promise<void> {
    console.log("\n--- Cadastro de Item no Cardápio ---");
    const nome = await ask("Insira o nome do item: ");
    const descricao = await ask("Insira a descrição do item: ");
    const preco = Number(await ask("Insira o valor do item: "));
    
    // Seleção de categoria de itens no cardapio
    let categoria: CategoriaItem = 'Outros'; 
    let categoriaValida = false;
    while (!categoriaValida) {
        console.log("\nSelecione a categoria do item:");
        console.log("1. Pizza");
        console.log("2. Bebida");
        console.log("3. Sobremesa");
        console.log("4. Outros");
        const opcaoCategoria = await ask("Opção: ");
        switch(opcaoCategoria) {
            case '1': categoria = 'Pizza'; categoriaValida = true; break;
            case '2': categoria = 'Bebida'; categoriaValida = true; break;
            case '3': categoria = 'Sobremesa'; categoriaValida = true; break;
            case '4': categoria = 'Outros'; categoriaValida = true; break;
            default: console.log("Opção de categoria inválida. Tente novamente.");
        }
    }

    // Adiciona um item no cardapio, verifica um ID para o item e salva no arquivo
    const cardapio = await carregarCardapio();
    const maxId = cardapio.reduce((max, item) => item.id > max ? item.id : max, 0); 
    const novoItem: ItemCardapio = { id: maxId + 1, nome, descricao, preco, categoria, disponivel: true };
    cardapio.push(novoItem);
    await salvarCardapio(cardapio); // puxa a constante novoItem para o array cardapio
    console.log(`\nItem "${novoItem.nome}" cadastrado com sucesso!`);
}

// Mostra o cardapio caso já exista
async function exibirCardapio(): Promise<void> {
    console.log("\n--- Cardapio Disponível ---");
    const cardapio = await carregarCardapio(); // puxa o array cardapio do arquivo
    if (cardapio.length === 0) { console.log("Nenhum item cadastrado no cardapio."); return; }
    cardapio.forEach(item => {
      const precoFormatado = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // Formata o preço
      console.log(`${item.id}. ${item.nome} - ${precoFormatado} [${item.categoria}]`);
      console.log(`   Descrição: ${item.descricao}`);
      console.log('---------------------------');
    });
}

// =================================================================
// ----------- FUNÇÕES DE GERENCIAMENTO DE PEDIDOS (CSV) -----------
// =================================================================

// Converte o array de pedidos para uma string CSV e salva no arquivo
async function salvarPedidos(pedidos: Pedido[]): Promise<void> {
    const header = 'id,nomeCliente,itens,total,status,data\n';
    const linhas = pedidos.map(pedido => {
      const itensString = pedido.itens.map(ip => `${ip.item.id}:${ip.quantidade}`).join(';'); // ip = item do pedido
      return `${pedido.id},"${pedido.nomeCliente}","${itensString}",${pedido.total},${pedido.status},${pedido.data}`;
    }).join('\n');
    await fs.writeFile(pedidosPath, header + linhas, 'utf-8'); // Salva o arquivo em formato CSV com o cabeçalho
}

// Lê o arquivo CSV de pedidos e o converte em um array de objetos
async function carregarPedidos(): Promise<Pedido[]> {
  const cardapio = await carregarCardapio();
  if (cardapio.length === 0) return []; // Caso não exista antes, carrega um array vazio
  try {
    const dadosDoArquivo = await fs.readFile(pedidosPath, 'utf-8');
    const linhas = dadosDoArquivo.trim().split('\n').slice(1);
    if (linhas.length === 0) return [];
    return linhas.map(linha => {
      const colunas = linha.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || []; // uma regex (expressão regular) para separar as colunas
      const itensString = colunas[2].replace(/"/g, '');                  // outra regex para limpar as aspas em caso de mais de um item
      const itens: ItemPedido[] = itensString.split(';').map(par => {    // Mapeia os itens do pedido pelo id e quantidade
        const [itemId, quantidade] = par.split(':');
        const itemDoCardapio = cardapio.find(c => c.id === Number(itemId));
        return { item: itemDoCardapio!, quantidade: Number(quantidade) };
      }).filter(ip => ip.item);
      return {
        id: Number(colunas[0]), nomeCliente: colunas[1].replace(/"/g, ''), itens: itens,
        total: Number(colunas[3]), status: colunas[4] as StatusPedido, data: colunas[5]
      };
    });
  } catch (error) {
    return [];
  }
}

// =================================================================
// -------------   FUNÇÃO DE CADASTRO DE PEDIDO  -------------------
// =================================================================
// Função para cadastrar um pedido, calcular o total e salvar o registro
async function cadastrarPedido(): Promise<void> {
    console.log("\n--- Cadastro de Pedido ---");
    await exibirCardapio();
    const cardapio = await carregarCardapio();
    if (cardapio.length === 0) { console.log("Não é possível registrar pedidos pois o cardapio está vazio."); return; }
    const nomeCliente = await ask("Digite o nome do cliente: ");
    const itensPedido: ItemPedido[] = [];
    // loop para pedir os itens de um pedido ao cliente
    let continuarPedindo = true;
    while (continuarPedindo) {
        const idPedido = await ask("\nDigite o ID do item que deseja adicionar (ou 'fim' para encerrar): ");
        if (idPedido.toLowerCase() === 'fim') { continuarPedindo = false; continue; }
        const id = Number(idPedido);
        const itemEncontrado = cardapio.find(item => item.id === id);
        if (itemEncontrado) {
            const qtPedido = await ask(`Quantas unidades de "${itemEncontrado.nome}" você deseja? `);
            const quantidade = Number(qtPedido);
            if (quantidade > 0) {
                itensPedido.push({ item: itemEncontrado, quantidade: quantidade });
                console.log(`${quantidade}x "${itemEncontrado.nome}" adicionado(s) ao pedido.`);
            } else { console.log("Quantidade inválida. O item não foi adicionado."); }
        } else { console.log("ID de item não encontrado. Tente novamente."); }
    }
    if (itensPedido.length === 0) { console.log("\nNenhum item foi adicionado. Pedido cancelado."); return; }
    // Calcula o total do pedido, gera um novo ID e salva o pedido no arquivo
    const total = itensPedido.reduce((soma, itemPedido) => soma + (itemPedido.item.preco * itemPedido.quantidade), 0);
    const todosPedidos = await carregarPedidos();
    const maxId = todosPedidos.reduce((max, pedido) => pedido.id > max ? pedido.id : max, 0);
    const novoPedido: Pedido = {
        id: maxId + 1, nomeCliente, itens: itensPedido, total, status: 'Recebido', data: new Date().toISOString()
    };
    // Salva o novo pedido no arquivo CSV
    todosPedidos.push(novoPedido);
    await salvarPedidos(todosPedidos);
    console.log("\n--- Pedido Registrado com Sucesso! ---");
    console.log(`Cliente: ${novoPedido.nomeCliente}`);
    console.log("Itens:");
    novoPedido.itens.forEach(ip => { console.log(`  - ${ip.quantidade}x ${ip.item.nome}`); });
    console.log(`Total do Pedido: ${novoPedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    console.log("---------------------------------------");
}

// =================================================================
// -----------    FUNÇÃO DE CONSULTA DE PEDIDO --------------------
// =================================================================

// Função para consultar um pedido não concluído pelo ID e exibir seus detalhes
async function consultarPedido(): Promise<void> {
    const todosPedidos = await carregarPedidos();
    const pedidosNaoConcluidos = todosPedidos.filter(p => p.status !== 'Concluído');
    if (pedidosNaoConcluidos.length === 0) {
        console.log("\nNão há pedidos ativos (não concluídos) no momento.");
        return;
    }
    // exibe IDs de pedidos não concluídos
    console.log("\n--- Pedidos Ativos (Não Concluídos) ---");
    pedidosNaoConcluidos.forEach(pedido => {
        console.log(`ID: ${pedido.id} | Cliente: ${pedido.nomeCliente} | Status: ${pedido.status}`);
    });
    console.log("---------------------------------------");
    // consulta o pedido pelo ID
    const idPedido = await ask("Digite o ID do pedido que deseja consultar em detalhes: ");
    const id = Number(idPedido);
    const pedido = todosPedidos.find(p => p.id === id);
    if (!pedido) {
        console.log("Pedido não encontrado.");
        return;
    }
    console.log("\n--- Detalhes do Pedido ---");
    console.log(`ID: ${pedido.id}`);
    console.log(`Cliente: ${pedido.nomeCliente}`);
    console.log(`Data: ${new Date(pedido.data).toLocaleString('pt-BR')}`);
    console.log(`Status: ${pedido.status}`);
    console.log("Itens:");
    pedido.itens.forEach(ip => {
        console.log(`  - ${ip.quantidade}x ${ip.item.nome}`);
    });
    console.log(`Total: ${pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    console.log("--------------------------");
}
// ========================================================================
// ----------------- FUNÇÕES DE GERENCIAMENTO DE PEDIDO -------------------
// ========================================================================

// Função para excluir um pedido pelo ID
async function excluirPedido(): Promise<void> {
    const idPedido = await ask("Digite o ID do pedido que deseja excluir: ");
    const id = Number(idPedido);
    let pedidos = await carregarPedidos();
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    if (pedidoIndex === -1) {
        console.log("Pedido não encontrado.");
        return;
    }
    const confirmacao = await ask(`Tem certeza que deseja excluir o pedido ${id} do cliente ${pedidos[pedidoIndex].nomeCliente}? (s/n): `);
    if (confirmacao.toLowerCase() === 's') {
        pedidos.splice(pedidoIndex, 1);
        await salvarPedidos(pedidos);
        console.log("Pedido excluído com sucesso.");
    } else {
        console.log("Exclusão cancelada.");
    }
}

// Função de atualizar os status de um pedido
async function atualizarStatusPedido(): Promise<void> {
    const idPedido = await ask("Digite o ID do pedido para atualizar o status: ");
    const id = Number(idPedido);
    let pedidos = await carregarPedidos();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) {
        console.log("Pedido não encontrado.");
        return;
    }
    console.log(`Status atual do pedido ${id}: ${pedido.status}`);
    console.log("Escolha o novo status:");
    console.log("1. Em preparação");
    console.log("2. Sendo Entregue");
    console.log("3. Concluído");
    const opcao = await ask("Opção: ");
    let novoStatus: StatusPedido | undefined;
    switch(opcao) {
        case '1': novoStatus = 'Em preparação'; break;
        case '2': novoStatus = 'Sendo Entregue'; break;
        case '3': novoStatus = 'Concluído'; break;
        default: console.log("Opção inválida."); return;
    }
    pedido.status = novoStatus;
    await salvarPedidos(pedidos);
    console.log(`Status do pedido ${id} atualizado para "${novoStatus}".`);
    if (novoStatus === 'Concluído') {
        Recibo(pedido);
    }
}

// =================================================================
// -----------  FUNÇÕES DE RELATÓRIOS E RECIBOS --------------------
// =================================================================

// Função para gerar um recibo
function Recibo(pedido: Pedido): void {
    console.log("\n\n==================== RECIBO ====================");
    console.log(`Pedido ID: ${pedido.id}`);
    console.log(`Cliente: ${pedido.nomeCliente}`);
    console.log(`Data: ${new Date(pedido.data).toLocaleString('pt-BR')}`);
    console.log("----------------------------------------------");
    console.log("Qtd.  Item".padEnd(30) + "Preço Unit.".padEnd(15) + "Subtotal");
    pedido.itens.forEach(itemPedido => {
        const nomeItem = `${itemPedido.quantidade}x    ${itemPedido.item.nome}`.padEnd(30);
        const precoUnit = itemPedido.item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).padEnd(15);
        const subtotal = (itemPedido.item.preco * itemPedido.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        console.log(nomeItem + precoUnit + subtotal);
    });
    console.log("----------------------------------------------");
    const totalFormatado = `TOTAL: ${pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    console.log(totalFormatado.padStart(50));
    console.log("==============================================\n\n");
}

// Função para gerar relatório diário/mensal de vendas de pizza
async function Relatorio(): Promise<void> {
    const pedidos = await carregarPedidos();
    if (pedidos.length === 0) {
        console.log("Nenhum pedido registrado para gerar relatórios.");
        return;
    }
    const hoje = new Date();
    const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    let pizzasVendidasHoje = 0;
    let pizzasVendidasMes = 0;
    for (const pedido of pedidos) {
        const dataPedido = new Date(pedido.data);
        if (dataPedido.toDateString() === hoje.toDateString()) {
            for (const itemPedido of pedido.itens) {
                if (itemPedido.item.categoria === 'Pizza') {
                    pizzasVendidasHoje += itemPedido.quantidade;
                }
            }
        }
        if (dataPedido >= inicioDoMes) {
            for (const itemPedido of pedido.itens) {
                if (itemPedido.item.categoria === 'Pizza') {
                    pizzasVendidasMes += itemPedido.quantidade;
                }
            }
        }
    }
    console.log("\n--- Relatório de Vendas de Pizzas ---");
    console.log(`Pizzas vendidas hoje: ${pizzasVendidasHoje}`);
    console.log(`Pizzas vendidas no mês: ${pizzasVendidasMes}`);
    console.log("-------------------------------------");
}

// =================================================================
// -----------. FUNÇÃO PRINCIPAL E INICIALIZAÇÃO .------------------
// =================================================================

// Garante que o diretório para armazenamento de dados exista.
async function pastaExiste(): Promise<void> {
    try {
        await fs.mkdir(pastaDB, { recursive: true });
    } catch (error) {
        console.error("Erro ao criar o diretório do banco de dados:", error);
        process.exit(1); // Encerra o programa se não for possível criar o diretório.
    }
}

// -------- Menu ----------
async function main() {
  await pastaExiste();
  let executando = true;
  while (executando) {
    console.log("\n===== SISTEMA DE PEDIDOS =====");
    console.log("1. Cadastrar novo item no cardápio");
    console.log("2. Cardápio");
    console.log("3. Registrar novo pedido");
    console.log("4. Consultar pedido");
    console.log("5. Atualizar status de um pedido");
    console.log("6. Excluir pedido");
    console.log("7. Relatório");
    console.log("8. Sair");
    const opcao = await ask("Escolha uma opção: ");
    switch (opcao) {
      case '1': await cadastrarItem(); break;
      case '2': await exibirCardapio(); break;
      case '3': await cadastrarPedido(); break;
      case '4': await consultarPedido(); break;
      case '5': await atualizarStatusPedido(); break;
      case '6': await excluirPedido(); break;
      case '7': await Relatorio(); break;
      case '8': executando = false; break;
      default: console.log("Opção inválida, tente novamente.");
    }
  }
  rl.close();
}

main();
