# Sistema de funcionamento de Pizzaria (Typescript + Node.js)
Aplicativo **CLI** (linha de comando) para gerenciar em **relatórios de vendas diárias e mensais de pizzas**, **gerencimento do cardapio** e **gerenciamento de pedidos**. Os dados como o cardapio e os pedidos são **mantidos em formato csv**.

---

## Recursos
* **Cadastrar novo item no cardápio** - Cadastra um item pelo: nome, descrição, preço, categoria (Pizza, bebida, sobremesa ou outro).
* **Listar Cardápio** - Lista o cardápio atual.
* **Registrar novo pedido** - Cadastra um pedido pelo nome do cliente e ID(s) dos itens. Além disso gera um recibo em csv com essas informações, status do pedido e o horário atual.
* **Consultar Pedido** - Permite a visualização de pedidos ativos (não concluídos) e a opção de saber mais detalhes de um pedido.
* **Atualizar status de um pedido** - Atualiza os status de um pedido para "Em preparação", "Sendo entregue" ou "Concluído".
* **Excluir Pedido** - Cancela um pedido não concluído pelo ID do pedido.
* **Relatório** - Gera um relatório sobre a venda diária e mensal de pizzas.

---

## Estrutura de pastas

```
Projeto-Typescript/
├─ js                 # arquivos .js gerados pelo TypeScript
    ├─ Banco de Dados # base de dados csv (cardapios e pedidos)
├─ ts                 # código-fonte .ts
├─ package-lock.json
├─ package.json
├─ tsconfig.json
```

## Arquivos CSV gerados
* `js/Banco de Dados/cardapio.csv` → `id,nome,descricao,preco,categoria,disponivel` | Registra o cardapio de forma facilmente expansível
* `js/Banco de Dados/pedidos.csv`  → `id,nomeCliente,itens,total,status,data`       | Registra detalhes de pedidos

## Pré-Requisitos

* **Node.js 16+** (recomendado 18 ou 20)
* **npm**

---

