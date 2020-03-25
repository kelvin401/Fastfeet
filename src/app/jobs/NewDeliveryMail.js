import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, delivery } = data;
    const addDelivery = parseISO(delivery.createdAt);
    const formattedDate = format(addDelivery, "dd 'de' MMMM', às' HH:mm'h'", {
      locale: pt,
    });

    await Mail.sendMail({
      to: `${deliveryman.name} ${deliveryman.email}`,
      subject: `Nova entrega disponível para ${deliveryman.name}`,
      template: 'NewDelivery',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
        recipient: recipient.name,
        address: recipient.address,
        house_number: recipient.house_number,
        address_additional: recipient.address_additional,
        state: recipient.state,
        city: recipient.city,
        zipcode: recipient.zipcode,
        createdAt: formattedDate,
      },
    });
  }
}

export default new NewDeliveryMail();
