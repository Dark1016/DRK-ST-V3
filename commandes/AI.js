const { zokou } = require('../framework/zokou');
const traduire = require("../framework/traduction");
const { default: axios } = require('axios');
//const conf = require('../set');

// Commande pour le bot
zokou({ nomCom: "bot", reaction: "📡", categorie: "IA" }, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg || !arg[0]) {
    return repondre("👂 Oui, je t'écoute. Quel est ton message ?");
  }

  try {
    // Traduction du message en anglais
    const message = await traduire(arg.join(' '), { to: 'en' });
    console.log(message);

    // Requête à BrainShop pour obtenir la réponse du bot
    fetch(`http://api.brainshop.ai/get?bid=177607&key=NwzhALqeO1kubFVD&uid=[uid]&msg=${message}`)
      .then(response => response.json())
      .then(data => {
        const botResponse = data.cnt;
        console.log(botResponse);

        // Traduction de la réponse du bot en français
        traduire(botResponse, { to: 'fr' })
          .then(translatedResponse => {
            repondre(translatedResponse);
          })
          .catch(error => {
            console.error('Erreur lors de la traduction en français :', error);
            repondre('⚠️ Erreur lors de la traduction en français.');
          });
      })
      .catch(error => {
        console.error('Erreur lors de la requête à BrainShop :', error);
        repondre('⚠️ Erreur lors de la requête à BrainShop.');
      });
  } catch (e) {
    repondre("❌ Oops, une erreur est survenue : " + e);
  }
});

// Commande pour générer une image
zokou({ nomCom: "dalle", reaction: "📡", categorie: "IA" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre("🖼️ Veuillez entrer les informations nécessaires pour générer l'image.");
    }

    // Regrouper les arguments en une seule chaîne séparée par des espaces
    const image = arg.join(' ');
    const response = await axios.get(`http://api.maher-zubair.tech/ai/photoleap?q=${image}`);
    
    const data = response.data;
    let caption = '*powered by ZOKOU-MD*';
    
    if (data.status === 200) {
      // Utiliser les données retournées par le service
      const imageUrl = data.result;
      zk.sendMessage(dest, { image: { url: imageUrl }, caption: caption }, { quoted: ms });
    } else {
      repondre("❌ Erreur lors de la génération de l'image.");
    }
  } catch (error) {
    console.error('Erreur :', error.message || 'Une erreur s\'est produite');
    repondre("⚠️ Oops, une erreur est survenue lors du traitement de votre demande.");
  }
});

// Commande pour GPT
zokou({ nomCom: "gpt", reaction: "📡", categorie: "IA" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre("🤖 Posez une question pour obtenir une réponse.");
    }

    // Regrouper les arguments en une seule chaîne séparée par des espaces
    const question = arg.join(' ');
    const response = await axios.get(`http://api.maher-zubair.tech/ai/chatgpt4?q=${question}`);
    
    const data = response.data;
    if (data) {
      repondre(data.result);
    } else {
      repondre("❌ Erreur lors de la génération de la réponse.");
    }
  } catch (error) {
    console.error('Erreur :', error.message || 'Une erreur s\'est produite');
    repondre("⚠️ Oops, une erreur est survenue lors du traitement de votre demande.");
  }
});
