import { z } from 'zod';

/**
 * Created

 * Zamówienie zostało utworzone.
 *
 * Draft
 *
 *
 *
 * Zamówienie robocze, np. tworzone przez administratora.
 *
 * AddingItems
 *
 *
 *
 * Aktywny koszyk, do którego klient dodaje produkty.
 *
 * ArrangingPayment
 *
 *
 *
 * Klient zakończył kompletowanie koszyka i przygotowuje płatność.
 *
 * PaymentAuthorized
 *
 *
 *
 * Płatność została autoryzowana, ale środki nie muszą być jeszcze pobrane.
 *
 * PaymentSettled
 *
 *
 *
 * Płatność została rozliczona.
 *
 * PartiallyShipped
 *
 *
 *
 * Część produktów została wysłana.
 *
 * Shipped
 *
 *
 *
 * Wszystkie produkty zostały wysłane.
 *
 * PartiallyDelivered
 *
 *
 *
 * Część produktów została dostarczona.
 *
 * Delivered
 *
 *
 *
 * Wszystkie produkty zostały dostarczone.
 *
 * Modifying
 *
 *
 *
 * Zamówienie jest modyfikowane po jego złożeniu.
 *
 * ArrangingAdditionalPayment
 *
 *
 *
 * Zamówienie wymaga dodatkowej płatności, np. po zwiększeniu jego wartości.
 *
 * Cancelled
 *
 *
 *
 * Zamówienie zostało anulowane.
 */

export const orderStates = {
  ArrangingPayment: 'ArrangingPayment',
};

export const transitionOrderToStateInputSchema = z.object({
  state: z.enum([...Object.values(orderStates)]),
});
