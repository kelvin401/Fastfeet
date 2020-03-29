import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipients from '../models/Recipients';
import File from '../models/File';

class DeliveriesDeliverymanController {
  async index(req, res) {
    const delivery = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
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
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(401).json({ error: "Deliveryman doesn't exists" });
    }

    return res.json(delivery);
  }
}

export default new DeliveriesDeliverymanController();
