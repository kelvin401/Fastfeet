import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    // Data Validations

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Check if deliveryman exist (search by email)

    const deliverymanExist = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExist) {
      return res.status(400).json({ error: 'Deliveryman already exists.' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    return res.json(
      await Deliveryman.findAll({
        order: [['id', 'ASC']],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        ],
      })
    );
  }

  async show(req, res) {
    const deliverymanExist = await Deliveryman.findOne({
      where: { id: req.params.id },
    });

    if (!deliverymanExist) {
      return res.status(400).json({ error: 'This deliveryman do not exist.' });
    }
    return res.json(deliverymanExist);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    const { name, email } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(401).json({ error: "Deliveryman doesn't exists" });
    }

    // Check if Deliveryman exist (search by cpf)

    if (email && email !== Deliveryman.email) {
      const deliverymanExist = await Deliveryman.findOne({ where: { email } });
      if (deliverymanExist) {
        res.status(400).json({ error: 'Deliveryman already exists.' });
      }
    }

    const { id } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res
        .status(401)
        .json({ error: `Deliveryman ${id} doesn't exists.` });
    }

    await deliveryman.destroy();
    return res.json({
      message: `Deliveryman ${deliveryman.name} has been deleted.`,
    });
  }
}
export default new DeliverymanController();
