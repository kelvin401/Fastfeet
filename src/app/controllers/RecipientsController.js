import * as Yup from 'yup';
import Recipients from '../models/Recipients';

class RecipientsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cpf: Yup.string()
        .required()
        .length(11),
      address: Yup.string().required(),
      house_number: Yup.string().required(),
      address_additional: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string().required(),
    });

    // Data Validations

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Check if recipient exist (search by cpf)

    const recipientExist = await Recipients.findOne({
      where: { cpf: req.body.cpf },
    });

    if (recipientExist) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const {
      id,
      name,
      cpf,
      address,
      house_number,
      address_additional,
      city,
      state,
      zipcode,
    } = await Recipients.create(req.body);

    return res.json({
      id,
      name,
      cpf,
      address,
      house_number,
      address_additional,
      city,
      state,
      zipcode,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      cpf: Yup.string().length(11),
      address: Yup.string(),
      house_number: Yup.string(),
      address_additional: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipcode: Yup.string(),
    });

    const { id, name, cpf } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipients.findByPk(req.params.id);

    if (!recipient) {
      return res.status(401).json({ error: "Recipient doesn't exists" });
    }

    // Check if recipient exist (search by cpf)

    if (cpf && cpf !== Recipients.cpf) {
      const recipientExist = await Recipients.findOne({ where: { cpf } });
      if (recipientExist) {
        res.status(400).json({ error: 'Recipient already exists.' });
      }
    }

    const {
      address,
      house_number,
      address_additional,
      city,
      state,
      zipcode,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      cpf,
      address,
      house_number,
      address_additional,
      city,
      state,
      zipcode,
    });
  }

  async index(req, res) {
    return res.json(await Recipients.findAll({ order: [['id', 'ASC']] }));
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      recipientId: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const { recipientId } = req.params;

    const recipient = await Recipients.findByPk(recipientId);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exist ' });
    }

    return res.json(recipient);
  }

  async delete(req, res) {
    const { id } = req.params;
    const recipient = await Recipients.findByPk(id);

    if (!recipient) {
      return res.status(401).json({ error: `User ${id} doesn't exists.` });
    }

    await recipient.destroy();
    return res.json({
      message: `Recipient ${recipient.name} has been deleted.`,
    });
  }
}
export default new RecipientsController();
