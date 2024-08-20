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

// Fonction pour créer la table "sudo"
async function createSudoTable() {
  const client = await pool.connect();
  try {
    // Exécutez une requête SQL pour créer la table "sudo" si elle n'existe pas déjà
    await client.query(`
      CREATE TABLE IF NOT EXISTS sudo (
        id SERIAL PRIMARY KEY,
        jid TEXT NOT NULL
      );
    `);
    console.log("La table 'sudo' a été créée avec succès. 🚀🔐 Prêts à autoriser les super utilisateurs !");
  } catch (error) {
    console.error("Une erreur est survenue lors de la création de la table 'sudo':", error);
  } finally {
    client.release();
  }
}

// Appelez la méthode pour créer la table "sudo"
createSudoTable();

// Fonction pour vérifier si un groupe est un super utilisateur
async function issudo(jid) {
  const client = await pool.connect();
  try {
    // Vérifiez si le groupe existe dans la table "sudo"
    const query = "SELECT EXISTS (SELECT 1 FROM sudo WHERE jid = $1)";
    const values = [jid];
    const result = await client.query(query, values);
    console.log(`Vérification pour ${jid}: ${result.rows[0].exists ? 'C\'est un super utilisateur ! 🏆' : 'Pas dans les super utilisateurs... 🤔'}`);
    return result.rows[0].exists;
  } catch (error) {
    console.error("Erreur lors de la vérification du super utilisateur :", error);
    return false;
  } finally {
    client.release();
  }
}

// Fonction pour supprimer un super utilisateur
async function removeSudoNumber(jid) {
  const client = await pool.connect();
  try {
    // Supprimez le numéro de téléphone de la table "sudo"
    const query = "DELETE FROM sudo WHERE jid = $1";
    const values = [jid];
    await client.query(query, values);
    console.log(`Numéro de téléphone ${jid} supprimé des super utilisateurs. 🚫✂️ Bye bye, pouvoir !`);
  } catch (error) {
    console.error("Erreur lors de la suppression du super utilisateur :", error);
  } finally {
    client.release();
  }
}

// Fonction pour ajouter un super utilisateur
async function addSudoNumber(jid) {
  const client = await pool.connect();
  try {
    // Insérez le numéro de téléphone dans la table "sudo"
    const query = "INSERT INTO sudo (jid) VALUES ($1)";
    const values = [jid];
    await client.query(query, values);
    console.log(`Numéro de téléphone ${jid} ajouté aux super utilisateurs. 🚀👑 Bienvenue dans la légende !`);
  } catch (error) {
    console.error("Erreur lors de l'ajout du super utilisateur :", error);
  } finally {
    client.release();
  }
}

// Fonction pour obtenir tous les super utilisateurs
async function getAllSudoNumbers() {
  const client = await pool.connect();
  try {
    // Sélectionnez tous les numéros de téléphone de la table "sudo"
    const query = "SELECT jid FROM sudo";
    const result = await client.query(query);
    const sudoNumbers = result.rows.map((row) => row.jid);
    console.log("Voici tous les super utilisateurs : 🌟", sudoNumbers);
    return sudoNumbers;
  } catch (error) {
    console.error("Erreur lors de la récupération des super utilisateurs :", error);
    return [];
  } finally {
    client.release();
  }
}

// Fonction pour vérifier si la table "sudo" n'est pas vide
async function isSudoTableNotEmpty() {
  const client = await pool.connect();
  try {
    // Exécutez une requête SQL pour compter le nombre de lignes dans la table "sudo"
    const result = await client.query('SELECT COUNT(*) FROM sudo');
    const rowCount = parseInt(result.rows[0].count);
    console.log(`La table 'sudo' ${rowCount > 0 ? 'n\'est pas vide ! 🏆' : 'est vide... 😢'}`);
    return rowCount > 0;
  } catch (error) {
    console.error('Erreur lors de la vérification de la table "sudo" :', error);
    return false; // En cas d'erreur, considérez la table comme vide
  } finally {
    client.release();
  }
}

module.exports = {
  issudo,
  addSudoNumber,
  removeSudoNumber,
  getAllSudoNumbers,
  isSudoTableNotEmpty
};
