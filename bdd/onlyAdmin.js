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

// Créez une pool de connexions PostgreSQL
const pool = new Pool(proConfig);

// Fonction pour créer la table "onlyAdmin"
const creerTableOnlyAdmin = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS onlyAdmin (
        groupeJid TEXT PRIMARY KEY
      );
    `);
    console.log("La table 'onlyAdmin' a été créée avec succès. 👑📋 Les admins peuvent respirer ! 🚀");
  } catch (e) {
    console.error("Une erreur est survenue lors de la création de la table 'onlyAdmin':", e);
  }
};

// Appelez la méthode pour créer la table "onlyAdmin"
creerTableOnlyAdmin();

// Fonction pour ajouter un groupe à la liste des groupes autorisés uniquement aux administrateurs
async function addGroupToOnlyAdminList(groupeJid) {
  const client = await pool.connect();
  try {
    // Insérez le groupe dans la table "onlyAdmin"
    const query = "INSERT INTO onlyAdmin (groupeJid) VALUES ($1)";
    const values = [groupeJid];

    await client.query(query, values);
    console.log(`Groupe JID ${groupeJid} ajouté à la liste des groupes onlyAdmin. 🙌🔒 Les admins sont ravis !`);
  } catch (error) {
    console.error("Erreur lors de l'ajout du groupe onlyAdmin :", error);
  } finally {
    client.release();
  }
}

// Fonction pour vérifier si un groupe est autorisé uniquement aux administrateurs
async function isGroupOnlyAdmin(groupeJid) {
  const client = await pool.connect();
  try {
    // Vérifiez si le groupe existe dans la table "onlyAdmin"
    const query = "SELECT EXISTS (SELECT 1 FROM onlyAdmin WHERE groupeJid = $1)";
    const values = [groupeJid];

    const result = await client.query(query, values);
    const isOnlyAdmin = result.rows[0].exists;
    console.log(`Vérification de ${groupeJid}: ${isOnlyAdmin ? 'C\'est un groupe onlyAdmin ! 🎯' : 'Ce groupe n\'est pas dans la liste des admins. 🤷‍♂️'}`);
    return isOnlyAdmin;
  } catch (error) {
    console.error("Erreur lors de la vérification du groupe onlyAdmin :", error);
    return false;
  } finally {
    client.release();
  }
}

// Fonction pour supprimer un groupe de la liste des groupes onlyAdmin
async function removeGroupFromOnlyAdminList(groupeJid) {
  const client = await pool.connect();
  try {
    // Supprimez le groupe de la table "onlyAdmin"
    const query = "DELETE FROM onlyAdmin WHERE groupeJid = $1";
    const values = [groupeJid];

    await client.query(query, values);
    console.log(`Groupe JID ${groupeJid} supprimé de la liste des groupes onlyAdmin. 💔❌ Le règne des admins est perturbé !`);
  } catch (error) {
    console.error("Erreur lors de la suppression du groupe onlyAdmin :", error);
  } finally {
    client.release();
  }
}

module.exports = {
  addGroupToOnlyAdminList,
  isGroupOnlyAdmin,
  removeGroupFromOnlyAdminList,
};
