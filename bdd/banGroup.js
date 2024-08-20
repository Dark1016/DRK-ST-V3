// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");

// Utilisez le module 'set' pour obtenir la valeur de DATABASE_URL depuis vos configurations
const s = require("../set");

// Récupérez l'URL de la base de données de la variable s.DATABASE_URL avec une touche de suspense
var dbUrl = s.DATABASE_URL ? s.DATABASE_URL : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Créez une pool de connexions PostgreSQL parce que pourquoi pas !
const pool = new Pool(proConfig);

// Fonction pour créer la table "banGroup" avec un peu d'humour noir
const creerTableBanGroup = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banGroup (
        groupeJid text PRIMARY KEY
      );
    `);
    console.log("🎉 La table 'banGroup' a été créée avec succès. Est-ce qu'on s'en servira ? Mystère...");
  } catch (e) {
    console.error("❌ Une erreur est survenue lors de la création de la table 'banGroup' : ", e);
  }
};

// Appelez la méthode pour créer la table "banGroup" parce qu'il faut bien commencer quelque part
creerTableBanGroup();

// Fonction pour ajouter un groupe à la liste des groupes bannis avec une touche de sarcasme
async function addGroupToBanList(groupeJid) {
  const client = await pool.connect();
  try {
    // Insérez le groupe dans la table "banGroup"
    const query = "INSERT INTO banGroup (groupeJid) VALUES ($1)";
    const values = [groupeJid];

    await client.query(query, values);
    console.log(`🚫 Groupe JID ${groupeJid} ajouté à la liste des groupes bannis. Dommage pour eux.`);
  } catch (error) {
    console.error("💀 Erreur lors de l'ajout du groupe banni : ", error);
  } finally {
    client.release();
  }
}

// Fonction pour vérifier si un groupe est banni avec une pointe de défiance
async function isGroupBanned(groupeJid) {
  const client = await pool.connect();
  try {
    // Vérifiez si le groupe existe dans la table "banGroup"
    const query = "SELECT EXISTS (SELECT 1 FROM banGroup WHERE groupeJid = $1)";
    const values = [groupeJid];

    const result = await client.query(query, values);
    const banni = result.rows[0].exists;
    console.log(`🔍 Vérification du statut de bannissement pour ${groupeJid}. Résultat : ${banni ? "OUI" : "NON"}.`);
    return banni;
  } catch (error) {
    console.error("💢 Erreur lors de la vérification du groupe banni : ", error);
    return false;
  } finally {
    client.release();
  }
}

// Fonction pour supprimer un groupe de la liste des groupes bannis avec un petit adieu
async function removeGroupFromBanList(groupeJid) {
  const client = await pool.connect();
  try {
    // Supprimez le groupe de la table "banGroup"
    const query = "DELETE FROM banGroup WHERE groupeJid = $1";
    const values = [groupeJid];

    await client.query(query, values);
    console.log(`👋 Groupe JID ${groupeJid} supprimé de la liste des groupes bannis. À jamais... ou pas.`);
  } catch (error) {
    console.error("🔥 Erreur lors de la suppression du groupe banni : ", error);
  } finally {
    client.release();
  }
}

// Exportez les fonctions avec un dernier clin d'œil
module.exports = {
  addGroupToBanList,
  isGroupBanned,
  removeGroupFromBanList,
  troll: "T'as réussi à tout lire ? Respect."
};
