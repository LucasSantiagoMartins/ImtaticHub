const db = require('../config/db')
const { isAddEventValidRequest } = require("../utils/user/validators/add-event-validator")
const {handleSingleUpload } = require('../middleware/upload')

exports.adminPage = async (req, res) => {
    return res.render('admin/general-panel')
}

exports.addEvent = async (req, res) => {
  try {
    const file = await handleSingleUpload(req, res, 'eventBanner'); 
    const { eventName, eventDescription, eventDate, eventCategory } = req.body;

    isAddEventValidRequest(req.body, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      const [rows] = await db.query('SELECT * FROM event_categories WHERE name = ?', [eventCategory]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Categoria do evento não encontrada." });
      }

      let { eventTime } = req.body;
      if (!eventTime || eventTime.trim() === '') {
        eventTime = null;
      }

      const bannerFilename = file?.filename || null;

      await db.query(`
        INSERT INTO events (name, description, event_date, event_time, event_category_id, banner)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [eventName, eventDescription, eventDate, eventTime, rows[0].id, bannerFilename]);

      return res.status(200).json({ message: "Evento adicionado com sucesso." });
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};


exports.getEvents = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                e.id,
                e.name,
                e.description,
                e.qtd_likes,
                e.qtd_views,
                e.event_date,
                e.event_time,
                e.created_at,
                e.banner,
                c.name AS category_name
            FROM events e
            JOIN event_categories c ON e.event_category_id = c.id;
        `);

        if (rows.length === 0) {
            return res.status(204).json({ message: "Sem eventos até o momento." });
        }

        return res.status(200).json({ events: rows });
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
};


exports.eventsPage = async (req, res) => {
    const [rows] = await db.query(`
            SELECT 
                e.id,
                e.name,
                e.description,
                e.qtd_likes,
                e.qtd_views,
                e.event_date,
                e.event_time,
                e.created_at,
                e.banner,
                c.name AS category_name
            FROM events e
            JOIN event_categories c ON e.event_category_id = c.id;
        `);

        console.log(rows)
        
    return res.render('admin/events',{ events: rows })
}