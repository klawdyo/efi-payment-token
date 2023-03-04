/* eslint-disable camelcase */
import { JSEncrypt } from 'jsencrypt/lib/JSEncrypt'
import { URLSearchParams } from 'url'

/**
 * Converte os dados do cartão de crédito em um paymentToken
 */
export async function usePaymentToken(payeeCode: string, card: CardPayload): Promise<CardToken> {
  const [salt, pubkey] = await Promise.all([getSalt(payeeCode), getPublicKey(payeeCode)])

  const cardData = { ...card, salt }

  const cardDataEncrypted = getCardDataEncrypted(pubkey, cardData)

  if (cardDataEncrypted) return saveCardData(payeeCode, cardDataEncrypted)
  throw new Error('Não foi possível gerar o payment_token')
}

/**
 * Pega o salt para cálculo do token
 */
export async function getSalt(payeeCode: string): Promise<string> {
  // https://tokenizer.gerencianet.com.br/salt
  const url = '/salt'
  const options = { headers: { 'account-code': payeeCode } }

  const result = await fetch(url, options)

  const { data } = await result.json()

  return data
}

/**
 * Pega o publicKey para cálculo do token
 */
export async function getPublicKey(payeeCode: string): Promise<string> {
  // https://sandbox.gerencianet.com.br/v1/pubkey
  const url = '/pubkey'
  const query = new URLSearchParams({ code: payeeCode })

  const result = await fetch(`${url}?${query}`)

  const { data } = await result.json()
  return data
}

/**
 * Criptografa os dados do cartão antes de solicitar o token
 */
export function getCardDataEncrypted(publicKey: string, cardData: CardRequest): string | null {
  const crypt = new JSEncrypt()
  crypt.setPublicKey(publicKey)
  const encryptedCardData = crypt.encrypt(JSON.stringify(cardData))

  if (encryptedCardData) return encryptedCardData
  return null
}

/**
 * Solicita o token do cartão à API do gerencianet
 */
export async function saveCardData(
  payeeCode: string,
  cardDataEncrypted?: string,
): Promise<CardToken> {
  const payload = JSON.stringify({ data: cardDataEncrypted })

  const headers = {
    'account-code': payeeCode,
    'Content-Type': 'application/json',
  }

  const result = await fetch('/card', {
    method: 'POST',
    body: payload,
    headers,
  })

  const { data } = await result.json()

  return {
    cardMask: data.card_mask,
    paymentToken: data.payment_token,
  }
}

/**
 * Dados do cartão recebidos do cliente
 */
export interface CardPayload {
  brand: string
  number: string
  cvv: string
  expiration_month: string
  expiration_year: string
}

/**
 * Requisição
 */
export interface CardRequest extends CardPayload {
  salt: string
}

/**
 * Dados do cartão convertidos em token
 */
export interface CardToken {
  paymentToken: string
  cardMask: string
}
