/* eslint-disable camelcase */
import { JSEncrypt } from 'jsencrypt/lib/JSEncrypt'
import { CardRequest } from '_interfaces/card-request.interface'
import { CardToken } from '_interfaces/card-token.interface'

export class Efi {
  /**
   * Pega o salt para cálculo do token
   */
  async getSalt(payeeCode: string): Promise<string> {
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
  async getPublicKey(payeeCode: string): Promise<string> {
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
  getCardDataEncrypted(publicKey: string, cardData: CardRequest): string | null {
    const crypt = new JSEncrypt()
    crypt.setPublicKey(publicKey)
    const encryptedCardData = crypt.encrypt(JSON.stringify(cardData))

    if (encryptedCardData) return encryptedCardData
    return null
  }

  /**
   * Solicita o token do cartão à API do gerencianet
   */
  async saveCardData(payeeCode: string, cardDataEncrypted?: string): Promise<CardToken> {
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
}
