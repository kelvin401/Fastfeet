import Deliveryman from '../models/Deliveryman';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const checkIsDeliveryman = await Deliveryman.findByPk(req.userId);

    if (!checkIsDeliveryman) {
      return res
        .status(401)
        .json({ error: 'Only deliveryman can load notifications.' });
    }

    const notifications = await Notification.find({
      deliveryman: req.Delivderyman_id,
    })
      .sort('createdAt')
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
