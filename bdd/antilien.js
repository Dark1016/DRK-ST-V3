require("dotenv").config();
const { Pool } = require("pg");
let s = require("../set");

// URL de la base de données avec un troll subtil
var dbUrl = s.DATABASE_URL ? s.DATABASE_URL : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";

const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

// Fonction pour créer la table "antilien" avec un petit troll
async function createAntilienTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS antilien (
        jid text PRIMARY KEY,
        etat text,
        action text
      );
    `);
    console.log("🎉 La table 'antilien' a été créée avec succès. Peut-être. Qui sait ?");
  } catch (error) {
    console.error("❌ Une erreur est survenue lors de la création de la table 'antilien' : ", error);
  } finally {
    client.release();
  }
}

// Appelez la méthode pour créer la table "antilien" avec un troll
createAntilienTable().then(() => {
  console.log("💥 Table 'antilien' créée, ou peut-être pas, mais on va faire comme si !");
}).catch(error => {
  console.error("🚨 Oups, ça n'a pas marché. Mais chut, on dira rien... :", error);
});

// Fonction pour ajouter ou mettre à jour un JID avec un troll
async function ajouterOuMettreAJourJid(jid, etat) {
  const client = await pool.connect();
  
  try {
    const result = await client.query('SELECT * FROM antilien WHERE jid = $1', [jid]);
    const jidExiste = result.rows.length > 0;

    if (jidExiste) {
      await client.query('UPDATE antilien SET etat = $1 WHERE jid = $2', [etat, jid]);
      console.log(`✏️ Le JID ${jid} a été mis à jour. En vrai, t'es sûr que ça marche ?`);
    } else {
      await client.query('INSERT INTO antilien (jid, etat, action) VALUES ($1, $2, $3)', [jid, etat, 'supp']);
      console.log(`➕ JID ${jid} ajouté avec l'état '${etat}' et action 'supp'. On va dire que c'est bon.`);
    }
  } catch (error) {
    console.error('💀 Erreur lors de l\'ajout ou de la mise à jour du JID dans la table :', error);
  } finally {
    client.release();
  }
}

// Fonction pour mettre à jour l'action d'un JID avec un troll
async function mettreAJourAction(jid, action) {
  const client = await pool.connect();
  
  try {
    const result = await client.query('SELECT * FROM antilien WHERE jid = $1', [jid]);
    const jidExiste = result.rows.length > 0;

    if (jidExiste) {
      await client.query('UPDATE antilien SET action = $1 WHERE jid = $2', [action, jid]);
      console.log(`🔄 Action mise à jour pour le JID ${jid}. Non mais sérieux, t'es sûr que ça va marcher ?`);
    } else {
      await client.query('INSERT INTO antilien (jid, etat, action) VALUES ($1, $2, $3)', [jid, 'non', action]);
      console.log(`➕ JID ${jid} ajouté avec l'action '${action}'. T'inquiète, on a tout sous contrôle... ou pas.`);
    }
  } catch (error) {
    console.error('💥 Erreur lors de la mise à jour de l\'action pour le JID :', error);
  } finally {
    client.release();
  }
}

// Fonction pour vérifier l'état d'un JID avec un troll
async function verifierEtatJid(jid) {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT etat FROM antilien WHERE jid = $1', [jid]);
    
    if (result.rows.length > 0) {
      const etat = result.rows[0].etat;
      console.log(`👀 État du JID ${jid} vérifié. C'est ${etat === 'oui' ? 'oui' : 'non'}, mais tu savais déjà ça.`);
      return etat === 'oui';
    } else {
      console.log(`❓ JID ${jid} introuvable. Il n'a probablement jamais existé. Ou c'est juste toi qui l'as rêvé.`);
      return false;
    }
  } catch (error) {
    console.error('💀 Erreur lors de la vérification de l\'état du JID :', error);
    return false;
  } finally {
    client.release();
  }
}

// Fonction pour récupérer l'action d'un JID avec un troll
async function recupererActionJid(jid) {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT action FROM antilien WHERE jid = $1', [jid]);
    
    if (result.rows.length > 0) {
      const action = result.rows[0].action;
      console.log(`🎬 Action pour le JID ${jid} récupérée. On dirait que c'est ${action}. Ou alors c'est juste un bug.`);
      return action;
    } else {
      console.log(`❓ JID ${jid} introuvable. On va dire 'supp' par défaut, histoire de pas faire planter tout.`);
      return 'supp';
    }
  } catch (error) {
    console.error('💥 Erreur lors de la récupération de l\'action du JID :', error);
    return 'supp'; // Valeur par défaut en cas d'erreur
  } finally {
    client.release();
  }
}

// Exportation des fonctions avec un troll final
module.exports = {
  mettreAJourAction,
  ajouterOuMettreAJourJid,
  verifierEtatJid,
  recupererActionJid,
  troll: "Si tu vois ça, c'est que t'as cherché trop loin..."
};
