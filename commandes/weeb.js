const axios = require('axios');
const fs = require('fs');
const { zokou } = require("../framework/zokou");
const { writeFile } = require('fs/promises');

// Commande waifu
zokou({
  nomCom: "waifu",
  categorie: "Weeb",
  reaction: "😏"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/waifu'; // Remplacez avec le lien réel de l'API waifu.pics

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Oups ! Quelque chose s’est mal passé en récupérant les waifus. 😓');
  }
});

// Commande neko
zokou({
  nomCom: "neko",
  categorie: "Weeb",
  reaction: "😺"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/neko'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API de nekos

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Désolé, impossible de trouver des nekos à l’heure actuelle. 😿');
  }
});

// Commande shinobu
zokou({
  nomCom: "shinobu",
  categorie: "Weeb",
  reaction: "🦋"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/shinobu'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API avec des images de Shinobu

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Oups ! Shinobu ne se montre pas aujourd’hui. 🦋');
  }
});

// Commande megumin
zokou({
  nomCom: "megumin",
  categorie: "Weeb",
  reaction: "💥"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/megumin'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API avec des images de Megumin

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Explosion ! Mais pas d’images de Megumin pour l’instant. 💥');
  }
});

// Commande cosplay
zokou({
  nomCom: "cosplay",
  categorie: "Weeb",
  reaction: "😏"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    for (let i = 0; i < 5; i++) {
      let url = 'https://fantox-cosplay-api.onrender.com/';
      
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      const image = response.data;

      await writeFile('./cosplay.jpg', image);
      zk.sendMessage(origineMessage, { image: { url: `./cosplay.jpg` } }, { quoted: ms });
    }
  } catch (e) {
    repondre("Oups ! Une erreur est survenue avec les cosplays. Essayons encore. 🤔");
  }
});

// Commande couplepp
zokou({
  nomCom: "couplepp",
  categorie: "Weeb",
  reaction: "💞"
},
async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  let api = 'https://smiling-hosiery-bear.cyclic.app/weeb/couplepp';

  try {
    repondre('Préparez-vous pour une dose de mignonnerie ! 💞');
    const result = await axios.get(api);

    zk.sendMessage(dest, { image: { url: result.data.male }, caption: `Pour les messieurs` }, { quoted: ms });
    zk.sendMessage(dest, { image: { url: result.data.female }, caption: `_Pour les dames_` }, { quoted: ms });
  } catch (e) {
    repondre('Oups, un problème est survenu avec les couples. Essayons plus tard ! 😢');
  }
});
