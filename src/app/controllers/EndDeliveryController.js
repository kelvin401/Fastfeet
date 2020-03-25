import { getHours } from 'date-fns';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class EndDeliveryController {
  async update(req, res) {
    const date = new Date();
    const delivery = await Delivery.findOne({
      where: { id: req.params.id },
    });

    const { deliveryman_id, signature_id } = req.body;

    // Check if deliveryman_id exists
    const isDeliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!isDeliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    if (getHours(date) <= 8 || getHours(date) >= 24) {
      res.status(401).json({
        error: 'Currently unavailable. Try between 8:00h and 18:00h.',
      });
    }

    if (!(delivery.start_date === null)) {
      res.status(401).json({
        error: 'Delivery already finished.',
      });
    }

    if (!(delivery.end_date === null)) {
      res.status(401).json({
        error: 'Delivery already finished.',
      });
    }

    if (!(delivery.canceled_at === null)) {
      res.status(401).json({
        error: 'Delivery canceled.',
      });
    }
    const deliveryUpdate = await delivery.update({
      end_date: date,
      signature_id,
    });

    return res.json(deliveryUpdate);
  }
}

export default new EndDeliveryController();
