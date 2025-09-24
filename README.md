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
