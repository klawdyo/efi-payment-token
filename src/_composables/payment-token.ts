import { Efi } from ".."
import { CardPayload } from "../_interfaces/card-payload.interface"
import { CardToken } from "../_interfaces/card-token.interface"

/**
 * Converte os dados do cartão de crédito em um paymentToken
 */
 export async function usePaymentToken(payeeCode: string, card: CardPayload): Promise<CardToken> {
  const efi = new Efi()
  const [salt, pubkey] = await Promise.all([efi.getSalt(payeeCode), efi.getPublicKey(payeeCode)])

  const cardData = { ...card, salt }

  const cardDataEncrypted = efi.getCardDataEncrypted(pubkey, cardData)

  if (cardDataEncrypted) return efi.saveCardData(payeeCode, cardDataEncrypted)
  throw new Error('Não foi possível gerar o payment_token')
}
