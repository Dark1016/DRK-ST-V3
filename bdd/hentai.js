// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");

// Utilisez le module 'set' pour obtenir la valeur de DATABASE_URL depuis vos configurations
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

// Fonction pour créer la table "hentai" avec un message stylé
const creerTableHentai = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hentai (
        groupeJid text PRIMARY KEY
      );
    `);
    console.log("🚀 Table 'hentai' créée avec 'groupeJid' comme clé primaire. On est prêt pour l'action !");
  } catch (e) {
    console.error("💥 Oups, une erreur est survenue lors de la création de la table 'hentai' :", e);
  }
};

// Appelez la méthode pour créer la table "hentai" avec 'groupeJid' comme clé primaire
creerTableHentai();

// Fonction pour ajouter un groupe à la liste de hentai avec une touche de drama
async function addToHentaiList(groupeJid) {
  const client = await pool.connect();
  try {
    // Insérez le groupe dans la table "hentai"
    const query = "INSERT INTO hentai (groupeJid) VALUES ($1)";
    const values = [groupeJid];

    await client.query(query, values);
    console.log(`✅ Groupe JID ${groupeJid} ajouté à la liste de hentai. Plus de retour en arrière !`);
  } catch (error) {
    console.error("🚫 Erreur lors de l'ajout du groupe à la liste de hentai : Quelque chose a mal tourné.", error);
  } finally {
    client.release();
  }
}

// Fonction pour vérifier si un groupe est dans la liste de hentai avec un peu de mystère
async function checkFromHentaiList(groupeJid) {
  const client = await pool.connect();
  try {
    // Vérifiez si le groupe existe dans la table "hentai"
    const query = "SELECT EXISTS (SELECT 1 FROM hentai WHERE groupeJid = $1)";
    const values = [groupeJid];

    const result = await client.query(query, values);
    console.log(`🔍 Vérification du groupe JID ${groupeJid} : ${result.rows[0].exists ? "Présent dans la liste." : "Pas dans la liste."}`);
    return result.rows[0].exists;
  } catch (error) {
    console.error("❗ Erreur lors de la vérification de la présence du groupe dans la liste de hentai : C'est peut-être un signe.", error);
    return false;
  } finally {
    client.release();
  }
}

// Fonction pour supprimer un groupe de la liste de hentai avec une touche finale
async function removeFromHentaiList(groupeJid) {
  const client = await pool.connect();
  try {
    // Supprimez le groupe de la table "hentai"
    const query = "DELETE FROM hentai WHERE groupeJid = $1";
    const values = [groupeJid];

    await client.query(query, values);
    console.log(`❌ Groupe JID ${groupeJid} supprimé de la liste de hentai. Game over.`);
  } catch (error) {
    console.error("🔥 Erreur lors de la suppression du groupe de la liste de hentai : Ce n'est pas fini !", error);
  } finally {
    client.release();
  }
}

module.exports = {
  addToHentaiList,
  checkFromHentaiList,
  removeFromHentaiList,
};
