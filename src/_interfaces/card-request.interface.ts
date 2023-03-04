import { CardPayload } from "./card-payload.interface";

/**
 * Requisição
 */
export interface CardRequest extends CardPayload {
  salt: string
}
