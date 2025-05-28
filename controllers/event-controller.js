const db = require('../config/db')

exports.eventPage = async (req, res) => {
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
        console.log(rows)
    res.render('event/imtatic-events', {events : rows})
}
