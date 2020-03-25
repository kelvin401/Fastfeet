import { getHours, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class StartDateDeliveryController {
  async update(req, res) {
    const date = new Date();
    const delivery = await Delivery.findOne({
      where: { id: req.params.id },
    });

    const { deliveryman_id } = req.body;

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
        error: 'Delivery already started.',
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
    // The delivery person can only make 5 withdrawals per day.
    const { count: countDeliveriesDay } = await Delivery.findAndCountAll({
      where: {
        deliveryman_id,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if (countDeliveriesDay >= 5) {
      return res
        .status(400)
        .json({ error: 'you already made 5 deliveries today' });
    }

    const deliveryUpdate = await delivery.update({
      start_date: date,
    });

    return res.json(deliveryUpdate);
  }
}

export default new StartDateDeliveryController();
