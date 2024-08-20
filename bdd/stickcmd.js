// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");

// Utilisez le module 'set' pour obtenir la valeur de DATABASE_URL depuis vos configurations
const s = require("../set");

// Récupérez l'URL de la base de données de la variable s.DATABASE_URL ou utilisez l'URL par défaut
const dbUrl = s.DATABASE_URL || "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

// Fonction pour créer la table "stickcmd"
async function creerTableStickcmd() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stickcmd (
        cmd TEXT PRIMARY KEY,
        id TEXT NOT NULL
      );
    `);
    console.log("La table 'stickcmd' a été créée avec succès. 🎉📜 Prêt à coller des commandes !");
  } catch (e) {
    console.error("Oups, une erreur est survenue lors de la création de la table 'stickcmd':", e);
  }
}

creerTableStickcmd();

// Fonction pour ajouter un stickcmd à la table
async function addstickcmd(cmd, id) {
  let client;
  try {
    client = await pool.connect();
    const query = "INSERT INTO stickcmd(cmd, id) VALUES ($1, $2)";
    const values = [cmd, id];
    await client.query(query, values);
    console.log(`Commande '${cmd}' ajoutée avec succès pour l'ID ${id}. 🚀👌 Les trolls sont contents !`);
  } catch (error) {
    console.log('Erreur lors de l\'ajout du stickcmd:', error);
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Fonction pour vérifier si un ID est dans les stickcmd
async function inStickCmd(id) {
  let client;
  try {
    client = await pool.connect();
    const query = "SELECT EXISTS (SELECT 1 FROM stickcmd WHERE id = $1)";
    const values = [id];
    const result = await client.query(query, values);
    console.log(`Vérification de l'ID ${id}: ${result.rows[0].exists ? 'Trouvé dans les stickcmd ! 🎯' : 'Pas dans les stickcmd... 😕'}`);
    return result.rows[0].exists;
  } catch (error) {
    console.error("Erreur lors de la vérification du stickcmd:", error);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Fonction pour supprimer un stickcmd de la table
async function deleteCmd(cmd) {
  const client = await pool.connect();
  try {
    const query = "DELETE FROM stickcmd WHERE cmd = $1";
    const values = [cmd];
    await client.query(query, values);
    console.log(`Le stickcmd '${cmd}' a été supprimé de la liste. 🚫🔧 Bye bye, commande !`);
  } catch (error) {
    console.error("Erreur lors de la suppression du stickcmd :", error);
  } finally {
    client.release();
  }
}

// Fonction pour obtenir un stickcmd par ID
async function getCmdById(id) {
  let client;
  try {
    client = await pool.connect();
    const query = "SELECT cmd FROM stickcmd WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      console.log(`Commande trouvée pour l'ID ${id}: '${result.rows[0].cmd}'. 🎉📜`);
      return result.rows[0].cmd;
    } else {
      console.log(`Aucune commande trouvée pour l'ID ${id}. 😢`);
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du stickcmd par id :", error);
    return null;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Fonction pour obtenir toutes les commandes stickcmd
async function getAllStickCmds() {
  const client = await pool.connect();
  try {
    const query = "SELECT cmd FROM stickcmd";
    const result = await client.query(query);
    console.log("Voici toutes les commandes stickcmd: 📝", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Erreur lors de la récupération de toutes les commandes stickcmd :", error);
    return [];
  } finally {
    client.release();
  }
}

module.exports = {
  addstickcmd,
  deleteCmd,
  getCmdById,
  inStickCmd,
  getAllStickCmds,
};
