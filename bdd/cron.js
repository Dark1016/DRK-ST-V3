require("dotenv").config();
const { Pool } = require("pg");
let s = require("../set");
var dbUrl = s.DATABASE_URL ? s.DATABASE_URL : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";

const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

// Fonction pour créer la table "cron" avec une punchline bien placée
async function createTablecron() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS cron (
        group_id text PRIMARY KEY,
        mute_at text default null,
        unmute_at text default null
      );
    `);
    console.log("🔥 Table 'cron' créée avec succès. Parce que pourquoi se taire quand on peut tout contrôler ?");
  } catch (error) {
    console.error("💥 BOOM ! Échec lors de la création de la table 'cron' :", error);
  } finally {
    client.release();
  }
}

createTablecron();

// Fonction pour récupérer toutes les données de la table "cron" avec du style
async function getCron() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM cron');
    console.log("🕵️‍♂️ Les données de la table 'cron' sont sous surveillance.");
    return result.rows;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données de la table 'cron' : Même les pros font des erreurs parfois.", error);
  } finally {
    client.release();
  }
}

// Fonction pour ajouter ou mettre à jour un cron, parce qu'on ne fait pas les choses à moitié
async function addCron(group_id, rows, value) {
  const client = await pool.connect();
  try {
    let response = await client.query(`SELECT * FROM cron WHERE group_id = $1`, [group_id]);
    let exist = response.rows.length > 0;

    if (exist) {
      await client.query(`UPDATE cron SET ${rows} = $1 WHERE group_id = $2`, [value, group_id]);
      console.log(`🔄 Mise à jour : Le groupe ${group_id} a été mis à jour dans la table 'cron'. Toujours dans le game.`);
    } else {
      const query = `INSERT INTO cron (group_id, ${rows}) VALUES ($1, $2)`;
      await client.query(query, [group_id, value]);
      console.log(`➕ Ajout : Le groupe ${group_id} a été ajouté à la table 'cron'. Bienvenue dans le club.`);
    }
  } catch (error) {
    console.error("🚫 Erreur lors de l'ajout ou de la mise à jour dans la table 'cron' : Quelqu'un essaie de jouer avec le feu.", error);
  } finally {
    client.release();
  }
}

// Fonction pour récupérer un cron par ID avec une touche de mystère
async function getCronById(group_id) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM cron WHERE group_id = $1', [group_id]);
    console.log(`🔍 Détails pour ${group_id} trouvés. Maintenant, t'es dans la boucle.`);
    return result.rows[0];
  } catch (error) {
    console.error("❗ Erreur lors de la récupération des données pour l'ID donné : Pas de chance cette fois.", error);
  } finally {
    client.release();
  }
}

// Fonction pour supprimer un cron, avec un dernier adieu
async function delCron(group_id) {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM cron WHERE group_id = $1', [group_id]);
    console.log(`👋 Adieu ${group_id}. Ta présence dans la table 'cron' n'était que temporaire.`);
  } catch (error) {
    console.error("🔥 Erreur lors de la suppression de l'entrée dans la table 'cron' : C'est pas toi, c'est nous.", error);
  } finally {
    client.release();
  }
}

// Exportation des fonctions avec un petit message pour les curieux
module.exports = {
  getCron,
  addCron,
  delCron,
  getCronById,
  troll: "Tu pensais vraiment que t'avais tout vu ?"
};
