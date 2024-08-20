// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");

// Utilisez le module 'set' pour obtenir la valeur de DATABASE_URL depuis vos configurations
const s = require("../set");

// Récupérez l'URL de la base de données depuis s.DATABASE_URL ou utilisez l'URL par défaut
const dbUrl = s.DATABASE_URL || "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Créez une pool de connexions PostgreSQL
const pool = new Pool(proConfig);

// Fonction pour créer la table "users_rank" avec un rang
async function createUsersRankTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users_rank (
        id SERIAL PRIMARY KEY,
        jid VARCHAR(255) UNIQUE,
        xp INTEGER DEFAULT 0,
        messages INTEGER DEFAULT 0,
        rank VARCHAR(50) DEFAULT 'Novice' -- Colonne pour le rang des utilisateurs
      );
    `);
    console.log("💪 La table 'users_rank' a été créée avec succès. Les utilisateurs peuvent désormais s'affronter pour la gloire !");
    
    // Assurez-vous que l'utilisateur avec le numéro spécifique a le rang "God"
    await client.query(`
      INSERT INTO users_rank (jid, xp, messages, rank)
      VALUES ($1, $2, $3, 'God')
      ON CONFLICT (jid) DO UPDATE
      SET rank = 'God', xp = GREATEST(users_rank.xp, 1000000), messages = GREATEST(users_rank.messages, 1000);
    `, ['50931461936', 1000000, 1000]);
    console.log("👑 L'utilisateur avec le numéro 50931461936 est maintenant au niveau 'God'.");
    
  } catch (error) {
    console.error("🔥 Une erreur s'est produite lors de la création de la table 'users_rank':", error);
  } finally {
    client.release();
  }
}

// Exécutez la fonction de création de la table lors de l'initialisation
createUsersRankTable();

// Fonction pour ajouter ou mettre à jour les données d'un utilisateur
async function ajouterOuMettreAJourUserData(jid) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users_rank WHERE jid = $1', [jid]);
    const jidExiste = result.rows.length > 0;

    if (jidExiste) {
      if (jid === '50931461936') {
        // Assurez-vous que l'utilisateur avec le numéro spécifique est toujours au rang 'God'
        await client.query('UPDATE users_rank SET xp = GREATEST(xp + 10, 1000000), messages = GREATEST(messages + 1, 1000), rank = \'God\' WHERE jid = $1', [jid]);
      } else {
        // Mettez à jour XP et messages pour les autres utilisateurs
        await client.query('UPDATE users_rank SET xp = xp + 10, messages = messages + 1 WHERE jid = $1', [jid]);
      }
      console.log(`🚀 Utilisateur ${jid} mis à jour : +10 XP, +1 message. La montée en puissance est en marche !`);
    } else {
      // Ajoutez un nouvel utilisateur
      const rank = jid === '50931461936' ? 'God' : 'Novice';
      await client.query('INSERT INTO users_rank (jid, xp, messages, rank) VALUES ($1, $2, $3, $4)', [jid, 10, 1, rank]);
      console.log(`🌟 Nouvel utilisateur ajouté : ${jid} avec 10 XP, 1 message, rang ${rank}. Prêt à briller !`);
    }
  } catch (error) {
    console.error("🔥 Erreur lors de la mise à jour des données de l'utilisateur:", error);
  } finally {
    client.release();
  }
}

// Fonction pour obtenir le nombre de messages et d'XP par JID
async function getMessagesAndXPByJID(jid) {
  const client = await pool.connect();
  try {
    const query = 'SELECT messages, xp, rank FROM users_rank WHERE jid = $1';
    const result = await client.query(query, [jid]);

    if (result.rows.length > 0) {
      const { messages, xp, rank } = result.rows[0];
      console.log(`📊 Données pour ${jid} : ${messages} messages, ${xp} XP, rang ${rank}.`);
      return { messages, xp, rank };
    } else {
      console.log(`🔍 Aucun utilisateur trouvé pour le JID ${jid}.`);
      return { messages: 0, xp: 0, rank: 'Novice' };
    }
  } catch (error) {
    console.error("🔥 Erreur lors de la récupération des données de l'utilisateur:", error);
    return { messages: 0, xp: 0, rank: 'Novice' }; // En cas d'erreur, renvoyez des valeurs par défaut
  } finally {
    client.release();
  }
}

// Fonction pour obtenir les 10 utilisateurs avec le moins d'XP
async function getBottom10Users() {
  const client = await pool.connect();
  try {
    const query = 'SELECT jid, xp, messages, rank FROM users_rank ORDER BY xp ASC LIMIT 10';
    const result = await client.query(query);
    console.log("🔝 Voici les 10 utilisateurs avec le moins d'XP :");
    return result.rows;
  } catch (error) {
    console.error("🔥 Erreur lors de la récupération des 10 utilisateurs avec le moins d'XP:", error);
    return []; // En cas d'erreur, renvoyez un tableau vide
  } finally {
    client.release();
  }
}

module.exports = {
  ajouterOuMettreAJourUserData,
  getMessagesAndXPByJID,
  getBottom10Users,
};
