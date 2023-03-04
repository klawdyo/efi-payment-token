
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
