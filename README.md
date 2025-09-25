# Sistema de funcionamento de Pizzaria (Typescript + Node.js)
Aplicativo **CLI** (linha de comando) para gerenciar em **relatórios de vendas diárias e mensais de pizzas**, **gerencimento do cardapio** e **gerenciamento de pedidos**. Os dados como o cardapio e os pedidos são **mantidos em formato csv**.

---

## Sobre nós
Somos a Type&Dough um grupo formado na faculdade UniAnchieta para a realização de um trabalho na matéria **Programação em Typescript** dirigida pelo professor **Eduardo Popovici**.
## Quem somos nós:
* **Eduardo Fernando de Almeida Loschi |**
  **RA: 2509964 |**
  **Email: eduardofernandodealmeidaloschi@gmail.com**
* **João Vitor Quirino Ramos |**
  **RA: 2526428 |**
  **Email: joao.quirino21@hotmail.com**
  
---

## Recursos
* **Cadastrar novo item no cardápio** - Cadastra um item novo no cardápio.
* **Cardápio** - Lista o cardápio atual.
* **Registrar novo pedido** - Cadastra um pedido de um cliente.
* **Armazenamento** - `js/Banco de Dados/cardapio.csv` + `js/Banco de Dados/pedidos.csv`.
* **Consultar Pedido** - Permite a visualização de pedidos ativos (não concluídos) e a opção de saber mais detalhes de um pedido.
* **Atualizar status de um pedido** - Atualiza os status de um pedido para "Em preparação", "Sendo entregue" ou "Concluído".
* **Excluir Pedido** - Cancela um pedido não concluído pelo ID do pedido.
* **Relatório** - Gera um relatório sobre a venda diária e mensal de pizzas.

---

## Estrutura de pastas

```
Pizzaria/
├─ js                 # arquivos .js gerados pelo TypeScript
    ├─ Banco de Dados # base de dados csv (cardapios e pedidos) - Gerado pelo script
├─ ts                 # código-fonte .ts
├─ node_modules       # gerado no processo de instalação
├─ package.json
├─ tsconfig.json
```

## Arquivos CSV gerados
* `js/Banco de Dados/cardapio.csv` → `id,nome,descricao,preco,categoria,disponivel` | Registra o cardapio de forma facilmente expansível
* `js/Banco de Dados/pedidos.csv`  → `id,nomeCliente,itens,total,status,data`       | Registra detalhes de pedidos

## Pré-Requisitos

* **TypeScript** (recomendado a versão 5.9.2)
* **Node.js 16+** (recomendado 18 ou 20)
* **npm**

---

## Instalação

Na **raiz** do projeto (onde está o `tsconfig.json`, `package.json`):

```bash
npm i -D typescript ts-node @types/node
```

Crie (ou configure) os scripts no **package.json**:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node js/index.js",
    "dev": "ts-node ts/index.ts"
  }
}
```

`tsconfig.json` mínimo recomendado:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "rootDir": "./ts",
    "outDir": "./js",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"],
    "lib": ["ES2020"]
  },
  "include": ["ts/**/*"]
}
```

---

## Como executar

Navegue pelos diretórios até o diretório que guarda o arquivo typescript e transpile para javascript com:

`tsc nomedoarquivo.ts`

Para executar o arquivo transpilado (javascript) utilize:

`node nomedoarquivo.js`

---

# Uso (menu de console)

1. **Cadastrar novo item no cardápio** -> informe nome, descrição, preço, categoria (Pizza, bebida, sobremesa ou outro) do item, pela ordem solicitada no terminal. Armazena os itens em `js/Banco de Dados/cardapio.csv`.
2. **Cardápio** -> Imprime no terminal todo o cardápio desde que existe pelo menos um item.
3. **Registrar novo pedido** -> Informe nome do cliente, id do item no cardápio e quantidade. Armazena essa informação em `js/Banco de Dados/cardapio.csv`.
4. **Consultar pedido** -> Imprime no terminal IDs de pedidos (criados automaticamente a partir do registro de um novo pedido), informe um ID para ver mais detalhes de um pedido.
5. **Atualizar status de um pedido** -> Informe um ID de pedido e a condição atual do pedido pelo o que é requerido pelo terminal.
6. **Excluir Pedido** -> Informe um ID de pedido e confirme para cancelar um pedido registrado.
7. **Relatório** -> Imprime no terminal relatórios de vendas diárias e mensais de pizzas.

---

# Campos e Formatos

* **Datas**: ISO (ex: 2023-10-27T10:30:00Z).
* **preços de itens no cardápio**: exibido em **Real Brasileiro (BRL)**, no padrão `R$ 0,00`.
* **Item em um Pedido**: É armazenado em `pedidos.csv` de formato em que A:B, aonde A é o id do item dentro do cardápio e B a quantidade desse item requisitada pelo cliente.

---

# Limpeza / Reset
Para reiniciar todos os dados utilize:

`rm -rf "js/Banco de Dados"`

Para reiniciar apenas o cardápio utilize:

`rm "js/Banco de Dados/cardapio.csv"`

Para reiniciar apenas o registro dos pedidos utilize:

`rm js/Banco de Dados/pedidos.csv"`

> Utilize na raiz do projeto, também é possível remover manualmente navegando pelas pastas. Após exclusão de algum dos itens, eles serão criados novamente conforme sua necessidade ao utilizar o sistema.

---
# Representação Visual dos Diretórios

<img width="390" height="287" alt="Image" src="https://github.com/user-attachments/assets/bb55a878-3704-431e-9da9-c4ea69f38f7e" />

# Representação Visual do Funcionamento do Menu

<img width="629" height="564" alt="Image" src="https://github.com/user-attachments/assets/32c91650-101a-448d-82e3-48dda404c3d2" />
