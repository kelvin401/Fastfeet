import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipients from '../models/Recipients';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';
import Notification from '../schemas/Notification';
import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';

class Deliverycontroller {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    // checking if recipient_id exists
    const isRecipient = await Recipients.findOne({
      where: { id: recipient_id },
    });

    if (!isRecipient) {
      return res.status(401).json({ error: 'Recipient does not exists' });
    }

    // checking if the deliveryman_id exists
    const isDeliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!isDeliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    const delivery = await Delivery.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    /**
     * Notify deliveryman about a new delivery
     */
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    const recipient = await Recipients.findByPk(recipient_id);

    await Notification.create({
      content: `Nova entrega disponível para ${deliveryman.name}`,
      deliveryman: deliveryman_id,
    });

    await Queue.add(NewDeliveryMail.key, {
      deliveryman,
      recipient,
      delivery,
    });

    return res.json(delivery);
  }

  async index(req, res) {
    const { q: productName, page = 1 } = req.query;

    const response = productName
      ? await Delivery.findAll({
          where: {
            product: {
              [Op.iLike]: `${productName}%`,
            },
          },
          order: ['id'],
          attributes: [
            'id',
            'product',
            'start_date',
            'end_date',
            'canceled_at',
          ],
          include: [
            {
              model: Recipients,
              as: 'recipient',
              paranoid: false,
              attributes: [
                'name',
                'address',
                'house_number',
                'address_additional',
                'state',
                'city',
                'zipcode',
              ],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name'],
            },
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'url', 'path'],
            },
          ],
        })
      : await Delivery.findAll({
          attributes: [
            'id',
            'product',
            'start_date',
            'end_date',
            'canceled_at',
          ],
          order: ['id'],
          limit: 5,
          offset: (page - 1) * 5,
          include: [
            {
              model: Recipients,
              paranoid: false,
              as: 'recipient',
              attributes: [
                'name',
                'address',
                'house_number',
                'address_additional',
                'state',
                'city',
                'zipcode',
              ],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name'],
            },
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'url', 'path'],
            },
          ],
        });

    return res.json(response);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    // Data Validation
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findOne({
      where: { id: req.params.id },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found.' });
    }

    const deliveryUpdate = await delivery.update(req.body);

    return res.json(deliveryUpdate);
  }

  async delete(req, res) {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res
        .status(401)
        .json({ error: `Delivery ID: ${id} doesn't exists.` });
    }
    await delivery.destroy();

    return res.json({
      message: `Delivery ID: ${id} has been deleted.`,
    });
  }
}
export default new Deliverycontroller();
