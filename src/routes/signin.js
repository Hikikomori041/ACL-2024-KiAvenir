import Routeur from "../structures/Routeur.js";

/**
 * Les routes liées à la page d'inscription
 */
class SignInRouteur extends Routeur {
  /**
   * Construit la route
   */
  constructor() {
    super();
  }

  /**
   * Construit la route
   */
  build() {
    this.router.get("/signin", (req, res) => {
      res.render("signin", { title: "Inscription", name: "Nico" });
    });
  }
}

const signInRouteur = new SignInRouteur();
export default signInRouteur.router;
