import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveriesDeliverymanController {
  async index(req, res) {
    const delivery = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
    });

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(401).json({ error: "Deliveryman doesn't exists" });
    }

    return res.json(delivery);
  }
}

export default new DeliveriesDeliverymanController();
