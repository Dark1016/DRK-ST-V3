const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { zokou } = require("../framework/zokou");

// Définition de la commande 'stickersearch' dans la catégorie 'Search'
zokou({
  nomCom: "stickersearch",
  categorie: 'Search',
  reaction: "🍁"
},
async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg, nomAuteurMessage } = commandeOptions;

  // Vérifie si un terme de recherche est fourni
  if (!arg[0]) {
    repondre("Où est la demande ?");
    return;
  }

  const gifSearchTerm = arg.join(" ");
  const tenorApiKey = "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c"; // Remplacez par votre clé d'API Tenor

  try {
    // Recherche de GIFs avec Tenor API
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=${gifSearchTerm}&key=${tenorApiKey}&client_key=my_project&limit=8&media_filter=gif`
      );

      const gifUrl = response.data.results[i].media_formats.gif.url;

      // Création du sticker
      const packname = nomAuteurMessage; // Remplacez par le nom de votre pack de stickers

      const stickerMess = new Sticker(gifUrl, {
        pack: packname,
        author: 'DRK_ST_V3',
        type: StickerTypes.FULL,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 60,
        background: "transparent",
      });

      const stickerBuffer2 = await stickerMess.toBuffer();

      // Envoi du sticker
      zk.sendMessage(dest, { sticker: stickerBuffer2 }, { quoted: ms });
    }
  } catch (error) {
    console.error("Erreur lors de la recherche de stickers :", error);
    repondre("Erreur lors de la recherche de stickers.");
  }
});
