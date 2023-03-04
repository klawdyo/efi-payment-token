# efi-payment-token

Gera o token de pagamento de cartão de crédito para usar nas transações

## Instalação

```sh
# 1) Instale as dependências
yarn add jsencrypt

# 2) Copie o arquivo index.ts e use

```

## Configuração

Antes de usar é necessário cadastrar os proxy na interface para que os erros de CORS sejam eliminados de acordo com o seu builder.

As URLs usadas no código são:

- `salt`: usado para pegar o salt a partir da API do ~~Gerencianet~~ Efí
- `pubkey`: Usado para pegar a chave pública a partir da API o ~~Gerencianet~~ Efí
- `card`: Usado para gerar o token do cartão de crédito a partir da API do ~~Gerencianet~~ Efí

Os builders mais conhecidos aceitam a definição de um proxy para mascarar a verdadeira url que está sendo feita a requisição. Neste caso, esta biblioteca espera que os seguintes valores estejam definidos com estes valores:

**Desenvolvimento**

```
  '/salt': 'https://tokenizer.gerencianet.com.br/',
  '/pubkey': 'https://sandbox.gerencianet.com.br/v1/',
  '/card': 'https://sandbox.gerencianet.com.br/v1/',
```

**Produção**

```
  '/salt': 'https://tokenizer.gerencianet.com.br/',
  '/pubkey': 'https://sandbox.gerencianet.com.br/v1/',
  '/card': 'https://tokenizer.gerencianet.com.br/v1/',
```

### VITE

Para usar com `vite`, inclua as configurações abaixo no arquivo `vite.config.js`. As configurações servem para vue e react rodando com vite.

```ts
export default defineConfig({
  // [...] outras configurações
  server: {
    proxy: {
      '/salt': 'https://tokenizer.gerencianet.com.br/',
      '/pubkey': 'https://sandbox.gerencianet.com.br/v1/',
      '/card': 'https://sandbox.gerencianet.com.br/v1/',
    },
  },
})
```

> **Observação**: É possível que sirva em outros frameworks,porém não foi testado.

### VUE 2

Para usar com `Vue 2`, inclua o proxy abaixo no arquivo `vue.config.js`

```js
module.exports = {
	devServer: {
		proxy: {
			'^/salt': {
				target: 'https://tokenizer.gerencianet.com.br/',
			},
			'^/v1': {
				target: 'https://sandbox.gerencianet.com.br/'
			},
			'^/card': {
				target: 'https://sandbox.gerencianet.com.br/v1/'
			}
		}
	}
```

### NUXT 2

No arquivo `nuxt.config.js` incluir as configurações abaixo:

```js
// https://stackoverflow.com/a/66368519
export default {
  // [...] outras configurações
  proxy: {
    '/salt': {
      target: 'https://tokenizer.gerencianet.com.br/',
    },
    '/v1': {
      target: 'https://sandbox.gerencianet.com.br/',
    },
    '/card': {
      target: 'https://sandbox.gerencianet.com.br/v1/',
    },
  },
}
```

### NUXT 3

No arquivo `nuxt.config` incluir as configurações abaixo:

```js
// https://stackoverflow.com/a/66368519
export default defineNuxtConfig({
  // [...] outras configurações
  proxy: {
    '/salt': {
      target: 'https://tokenizer.gerencianet.com.br/',
    },
    '/v1': {
      target: 'https://sandbox.gerencianet.com.br/',
    },
    '/card': {
      target: 'https://sandbox.gerencianet.com.br/v1/',
    },
  },
})
```

> **Observações**: Para outros sistemas, pesquisar como aplicar proxy em suas configurações.

## Como usar

- Consiga o seu identificador de conta `payeeCode`.

```ts
// Seu código de cliente.
const payeeCode = '01234567890abcdef01234567890'
const creditCard = {
  brand: 'visa', // bandeira do cartão
  number: '4012001038443335', // número do cartão
  cvv: '123', // código de segurança
  expiration_month: '05', // mês de vencimento
  expiration_year: '2021', // ano de vencimento
}

const { paymentToken, cardMask } = await usePaymentToken(payeeCode, creditCard)
```

## Referências

- [Como conseguir o token de pagamento](https://dev.gerencianet.com.br/docs/pagamento-com-cartao#11-obten%C3%A7%C3%A3o-do-payment_token)
- [Usar proxy com React](https://www.youtube.com/watch?v=N4yUiQiTvwU&ab_channel=SamMeech-Ward)
- [Configuração do nuxt2](https://stackoverflow.com/a/66368519)
- [vitordesousa/vue2-gerencianet](https://github.com/vitordesousa/vue2-gerencianet.git)

### Passo a passo para conseguir o identificador de conta

- Passo 1

- Passo 2
