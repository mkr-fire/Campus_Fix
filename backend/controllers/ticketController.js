const Ticket = require('../models/Ticket');

let memoryTickets = [];

const validStatuses = ['Nouveau', 'En cours', 'Resolu'];

const buildMemoryTicket = ({
  reporterName,
  reporterContact,
  title,
  description,
  location,
  category,
  priority,
}) => ({
  _id: `memory-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  reporterName: reporterName || 'Invite',
  reporterContact: reporterContact || 'Non renseigne',
  title,
  description,
  location,
  category,
  priority: priority || 'Moyenne',
  status: 'Nouveau',
  createdAt: new Date().toISOString(),
});

const getMemoryTickets = (query) => {
  return memoryTickets.filter((ticket) => {
    const matchStatus = query.status ? ticket.status === query.status : true;
    const matchCategory = query.category ? ticket.category === query.category : true;
    return matchStatus && matchCategory;
  });
};

const createTicket = async (req, res, next) => {
  try {
    const { reporterName, reporterContact, title, description, location, category, priority } =
      req.body;

    if (global.useMemoryDb) {
      const ticket = buildMemoryTicket({
        reporterName,
        reporterContact,
        title,
        description,
        location,
        category,
        priority,
      });

      memoryTickets.unshift(ticket);
      return res.status(201).json(ticket);
    }

    const ticket = await Ticket.create({
      reporterName,
      reporterContact,
      title,
      description,
      location,
      category,
      priority,
    });

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    if (global.useMemoryDb) {
      return res.status(200).json(getMemoryTickets(req.query));
    }

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    if (global.useMemoryDb) {
      const ticket = memoryTickets.find((item) => item._id === req.params.id);

      if (!ticket) {
        return res.status(404).json({ message: 'Ticket non trouve' });
      }

      return res.status(200).json(ticket);
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouve' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Statut invalide. Valeurs acceptees : ${validStatuses.join(', ')}`,
      });
    }

    if (global.useMemoryDb) {
      const ticket = memoryTickets.find((item) => item._id === req.params.id);

      if (!ticket) {
        return res.status(404).json({ message: 'Ticket non trouve' });
      }

      ticket.status = status;
      return res.status(200).json(ticket);
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouve' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

module.exports = { createTicket, getTickets, getTicketById, updateStatus };
