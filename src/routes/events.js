import Routeur from "../structures/Routeur.js";
import moment from "moment";

/**
 * Les routes liées à la page des événements
 */
export default class EventRouteur extends Routeur {
  constructor(server) {
    super(server, null);
  }

  /**
   * Construit la route
   */
  build() {
    this.router.delete("/api/events/delete/:eventId", async (req, res) => {
      const event = this.server.database.tables.get("events").get(req.params.eventId);

      if (event) {
        await event.delete();
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    });

    this.router.put("/api/events/update/:eventId", (req, res) => {
      const event = this.server.database.tables.get("events").get(req.params.eventId);

      const fields = {
        name: req.body.title,
        description: req.body.description,
        startDate: req.body.start,
        endDate: req.body.end
      };

      if (event) {
        event
          .update(fields)
          .then(() => {
            res.json({
              success: true,
              message: "Événement mis à jour avec succès"
            });
          })
          .catch(() => {
            res.json({
              success: false,
              message: "Erreur lors de la mise à jour de l'événement"
            });
          });
      } else {
        res.json({
          success: false,
          message: "Erreur lors de la mise à jour de l'événement"
        });
      }
    });

    // Route pour créer un événement
    this.router.post("/api/events/create", (req, res) => {
      const newEvent = this.server.database.tables.get("events");
      if (newEvent) {
        newEvent
          .create(req.body)
          .then(() => {
            res.json({ success: true, message: "Événement créé avec succès" });
          })
          .catch(() => {
            res.json({
              success: false,
              message: "Erreur lors de la création de l'événement"
            });
          });
      } else {
        res.json({
          success: false,
          message: "Erreur lors de la création de l'événement"
        });
      }
    });

    this.router.get("/api/events/:agendaId", async (req, res) => {
      // Récupère le start et le end
      const start = req.query.start;
      const end = req.query.end;

      const agendaId = parseInt(req.params.agendaId);
      const agenda = await this.server.database.tables.get("agendas").get(agendaId);
      if (!agenda) {
        return res.json([]);
      }

      // Vérifie si le start et le end sont définis
      if (!start || !end) {
        return res.json([]);
      }

      await this.server.database.load();

      console.log(agendaId);
      console.log(this.server.database.tables.get("events").filter((e) => e.agendaId === agendaId).length);

      // Récupère les événements entre le start et le end
      const events = agenda
        .getEvents()
        .filter((e) => {
          return (
            agendaId === e.agendaId &&
            (moment(e.startDate).isBetween(start, end) || moment(e.endDate).isBetween(start, end))
          );
        })
        .map((e) => {
          return {
            eventId: e.eventId,
            description: e.description,
            title: e.name,
            start: moment(e.startDate).format(),
            end: moment(e.endDate).format()
          };
        });

      console.log(events);
      res.json(events);
    });
  }
}
