// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");
const s = require("../set");

// Récupérez l'URL de la base de données de la variable s.DATABASE_URL
var dbUrl = s.DATABASE_URL ? s.DATABASE_URL : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";

const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Créez une pool de connexions PostgreSQL
const pool = new Pool(proConfig);

const creerTableAfk = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS afk (
        id serial PRIMARY KEY,
        etat text DEFAULT 'off',
        message text,
        lien text
      );
    `);
    console.log("La table 'afk' a été créée avec succès. T'es chanceux, ça a marché du premier coup !");
  } catch (e) {
    console.error("Erreur lors de la création de la table 'afk':", e);
    console.log("Même PostgreSQL en a marre de tes conneries !");
  }
};

creerTableAfk();

async function addOrUpdateAfk(id, message, lien) {
  try {
    await pool.query(`
      INSERT INTO afk (id, message, lien)
      VALUES ($1, $2, $3)
      ON CONFLICT (id)
      DO UPDATE SET message = $2, lien = $3;
    `, [id, message, lien]);

    console.log("L'enregistrement AFK a été ajouté ou mis à jour. Bien joué, tu n'as pas tout cassé cette fois !");
  } catch (e) {
    console.error("Erreur lors de l'ajout ou mise à jour de l'AFK:", e);
    console.log("T'es tellement mauvais que même une simple requête SQL te trolle.");
  }
}

async function getAfkById(id) {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM afk
      WHERE id = $1;
    `, [id]);

    if (rows.length > 0) {
      console.log("Récupération réussie de l'enregistrement AFK.");
      return rows[0];
    } else {
      console.log("Aucun AFK trouvé. T'as cherché au bon endroit au moins ?");
      return null;
    }
  } catch (e) {
    console.error("Erreur lors de la récupération de l'AFK:", e);
    console.log("Une erreur est survenue, même la base de données se moque de toi.");
    return null;
  }
}

async function changeAfkState(id, etat) {
  try {
    const result = await pool.query(`
      UPDATE afk
      SET etat = $1
      WHERE id = $2
      RETURNING *;
    `, [etat, id]);

    if (result.rows.length === 0) {
      console.log("L'enregistrement AFK n'existe pas. Encore un coup pour rien.");
      return "not defined";
    } else {
      console.log("L'état de l'AFK a été modifié avec succès. Ça a marché cette fois, incroyable !");
      return "success";
    }
  } catch (e) {
    console.error("Erreur lors du changement de l'état AFK:", e);
    console.log("Change l'état ? T'es même pas foutu de changer de chaussettes !");
  }
}

module.exports = {
  addOrUpdateAfk,
  getAfkById,
  changeAfkState
}
