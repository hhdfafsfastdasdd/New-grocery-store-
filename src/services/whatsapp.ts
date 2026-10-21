import { AreaName, CustomOrderRequest, Order, OrderItem } from '../types';

/**
 * Clean phone numbers to international standard digits without '+' or spaces.
 * E.g., "+91 94370 12345" -> "919437012345"
 */
export function sanitizeWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

export interface WhatsAppOrderPayload {
  customerName: string;
  phone: string;
  address: string;
  area: AreaName;
  landmark?: string;
  instructions?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  finalTotal: number;
  orderNumber?: string;
}

/**
 * Builds the exact message specified in Section 6.A of the prompt
 */
export function generateWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const { customerName, phone, address, area, items, subtotal, deliveryCharge, finalTotal, orderNumber } = payload;

  const itemLines = items
    .map((item, idx) => `${idx + 1}. ${item.name} - ${item.weight} - ₹${item.itemTotal}`)
    .join('\n');

  let message = `Hello Smart Grocery!\n\nI want to place a grocery order.\n\nCustomer Name: ${customerName}\nPhone: ${phone}\nAddress: ${address}${payload.landmark ? ` (Landmark: ${payload.landmark})` : ''}\nArea: ${area}\n\nOrder Items:\n${itemLines}\n\nSubtotal: ₹${subtotal}\nDelivery Charge: ₹${deliveryCharge}\nTotal Amount: ₹${finalTotal}`;

  if (orderNumber) {
    message = `Order Reference: ${orderNumber}\n\n` + message;
  }

  if (payload.instructions && payload.instructions.trim()) {
    message += `\n\nDelivery Instructions: ${payload.instructions.trim()}`;
  }

  message += `\n\nPlease confirm my order.`;

  return message;
}

/**
 * Opens the WhatsApp chat window with the pre-filled message
 */
export function openWhatsAppOrder(
  ownerWhatsApp: string,
  payload: WhatsAppOrderPayload
): string {
  const sanitizedNumber = sanitizeWhatsAppNumber(ownerWhatsApp);
  const message = generateWhatsAppOrderMessage(payload);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`;

  // Open in new tab or window
  window.open(url, '_blank', 'noopener,noreferrer');
  return url;
}

/**
 * Builds and opens custom grocery order message (Section 6.B)
 */
export function openCustomOrderWhatsApp(
  ownerWhatsApp: string,
  data: {
    customerName: string;
    phone: string;
    address: string;
    area: AreaName;
    requestedItems: string;
    additionalRequirements?: string;
  }
): string {
  const sanitizedNumber = sanitizeWhatsAppNumber(ownerWhatsApp);

  let message = `Hello Smart Grocery!\n\nI want to request a Custom Grocery Order for items not listed on the website.\n\nCustomer Name: ${data.customerName}\nPhone: ${data.phone}\nAddress: ${data.address}\nArea: ${data.area}\n\nRequested Items & Quantities:\n${data.requestedItems}`;

  if (data.additionalRequirements && data.additionalRequirements.trim()) {
    message += `\n\nAdditional Requirements:\n${data.additionalRequirements.trim()}`;
  }

  message += `\n\nPlease check availability and let me know the price and delivery time. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`;

  window.open(url, '_blank', 'noopener,noreferrer');
  return url;
}

/**
 * Directly chats with a customer from the Admin panel
 */
export function openCustomerChatWhatsApp(customerPhone: string, text = 'Hello from Smart Grocery!'): void {
  const sanitizedNumber = sanitizeWhatsAppNumber(customerPhone);
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/${sanitizedNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
}
