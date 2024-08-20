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

// Fonction pour créer la table "alive"
const creerTableAlive = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alive (
        id serial PRIMARY KEY,
        message text,
        lien text
      );
    `);
    console.log("La table 'alive' a été créée avec succès. T'as bien fait d'écouter les instructions !");
  } catch (e) {
    console.error("Erreur lors de la création de la table 'alive':", e);
    console.log("Même PostgreSQL a décidé de te troller, ça commence bien !");
  }
};

// Appelez la méthode pour créer la table "alive"
creerTableAlive();

// Fonction pour ajouter ou mettre à jour un enregistrement dans la table "alive"
async function addOrUpdateDataInAlive(message, lien) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO alive (id, message, lien)
      VALUES (1, $1, $2)
      ON CONFLICT (id)
      DO UPDATE SET message = excluded.message, lien = excluded.lien;
    `;
    const values = [message, lien];
  
    await client.query(query, values);
    console.log("Données ajoutées ou mises à jour dans la table 'alive' avec succès. Bravo, tu ne t'es pas planté cette fois !");
  } catch (error) {
    console.error("Erreur lors de l'ajout ou de la mise à jour des données dans la table 'alive':", error);
    console.log("T'as tellement foiré que même ta table est en PLS !");
  } finally {
    client.release();
  }
}

// Fonction pour récupérer les données de la table "alive"
async function getDataFromAlive() {
  const client = await pool.connect();
  try {
    const query = "SELECT message, lien FROM alive WHERE id = 1";
    const result = await client.query(query);

    if (result.rows.length > 0) {
      const { message, lien } = result.rows[0];
      console.log("Les données ont été récupérées avec succès. On est encore en vie !");
      return { message, lien };
    } else {
      console.log("Aucune donnée trouvée dans la table 'alive'. C'est aussi vide que ton compte en banque.");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données depuis la table 'alive':", error);
    console.log("Oups, quelque chose a merdé... mais bon, t'es habitué, non ?");
    return null;
  } finally {
    client.release();
  }
}

module.exports = {
  addOrUpdateDataInAlive,
  getDataFromAlive,
};
