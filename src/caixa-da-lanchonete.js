class CaixaDaLanchonete {
  constructor() {
      // Este construtor foi utilizado para garantir o acesso ao mesmo cardápio independente da instância
      this.cardapio = {
          'cafe': { descricao: 'Café', valor: 3.00 },
          'chantily': { descricao: 'Chantily (extra do Café)', valor: 1.50 },
          'suco': { descricao: 'Suco Natural', valor: 6.20 },
          'sanduiche': { descricao: 'Sanduíche', valor: 6.50 },
          'queijo': { descricao: 'Queijo (extra do Sanduíche)', valor: 2.00 },
          'salgado': { descricao: 'Salgado', valor: 7.25 },
          'combo1': { descricao: '1 Suco e 1 Sanduíche', valor: 9.50 },
          'combo2': { descricao: '1 Café e 1 Sanduíche', valor: 7.50 },
      };
      this.formasDePagamento = ['dinheiro', 'debito', 'credito'];
  }

  // Verifica se um item específico está no cardápio
  checkItemCardapio(carrinho, item) {
      return Object.keys(carrinho).includes(item);
  }

  calcularValorDaCompra(formaDePagamento, itens) {
      // Valida a forma de pagamento
      if (!this.formasDePagamento.includes(formaDePagamento)) {
          return "Forma de pagamento inválida!";
      }

      // Valida carrinho vazio
      if (itens.length === 0) {
          return "Não há itens no carrinho de compra!";
      }

      // Cria um objeto carrinho para rastrear os itens e suas quantidades
      const carrinho = {};
      let total = 0;
      // Utilizei o Set() para evitar duplicidade de forma mais precisa e simples
      const itensPrincipais = new Set();

      for (const itemInfo of itens) {
          const [item, quantidade] = itemInfo.split(',');
          // Valida se o item existe no cardápio
          if (!(item in this.cardapio)) {
              return "Item inválido!";
          }

          const itemDescricao = this.cardapio[item].descricao;
          // Adiciona itens principais num conjunto pra validar posteriormente
          if (!itemDescricao.includes("extra")) {
              itensPrincipais.add(item);
          }

          // Inicializa o contador de quantidade pra cada item no carrinho
          if (!carrinho[item]) {
              carrinho[item] = 0;
          }

          // Adiciona a quantidade do item no carrinho
          carrinho[item] += parseInt(quantidade);
      }

      // Checa tudo do carrinho para calcular o valor total
      for (const item in carrinho) {
          // Valida se a quantidade do item é válida
          if (carrinho[item] <= 0) {
              return "Quantidade inválida!";
          }

          const itemInfo = this.cardapio[item];
          total += itemInfo.valor * carrinho[item];
      }

      // Aplica a regra de negócio referente ao dinheiro ou credito
      if (formaDePagamento === 'dinheiro') {
          total *= 0.95;
      } else if (formaDePagamento === 'credito') {
          total *= 1.03;
      }

      // Verifica se extras foram pedidos corretamente
      const temChantily = this.checkItemCardapio(carrinho, 'chantily');
      const temCafe = this.checkItemCardapio(carrinho, 'cafe');

      const checkQueijo = Object.keys(carrinho).includes('queijo');
      const checkSanduiche = Object.keys(carrinho).includes('sanduiche');

      // Validações de itens extras
      if (temChantily && !temCafe) {
          return 'Item extra não pode ser pedido sem o principal';
      }

      if (checkQueijo && !checkSanduiche) {
          return 'Item extra não pode ser pedido sem o principal';
      }

      return `R$ ${total.toFixed(2).replace('.', ',')}`;
  }
}

export { CaixaDaLanchonete };