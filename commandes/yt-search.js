const { zokou } = require("../framework/zokou");
const { getytlink, ytdwn } = require("../framework/ytdl-core");
const yts = require("yt-search");
const ytdl = require('ytdl-core');
const fs = require('fs');

// Commande pour rechercher des vidéos
zokou({
  nomCom: "yts",
  categorie: "Search",
  reaction: "✋"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;
  const query = arg.join(" ");

  if (!query) {
    repondre("Quelle vidéo cherches-tu ? 🎥");
    return;
  }

  try {
    const info = await yts(query);
    const resultat = info.videos;

    let captions = "";
    for (let i = 0; i < Math.min(resultat.length, 10); i++) {
      captions += `----------------\nTitre : ${resultat[i].title}\nDurée : ${resultat[i].timestamp}\nURL : ${resultat[i].url}\n`;
    }
    captions += "\n======\n*DRK* en action ! 🚀";

    zk.sendMessage(dest, { image: { url: resultat[0].thumbnail }, caption: captions }, { quoted: ms });
  } catch (error) {
    repondre("Oups ! Une erreur est survenue lors de la recherche : " + error.message);
  }
});

// Commande pour télécharger une vidéo en MP4
zokou({
  nomCom: "ytmp4",
  categorie: "Download",
  reaction: "🎥"
}, async (origineMessage, zk, commandeOptions) => {
  const { arg, ms, repondre } = commandeOptions;

  if (!arg[0]) {
    repondre("Insère un lien YouTube pour télécharger une vidéo.");
    return;
  }

  const topo = arg.join(" ");
  try {
    const videoInfo = await ytdl.getInfo(topo);
    const format = ytdl.chooseFormat(videoInfo.formats, { quality: '18' });
    const videoStream = ytdl.downloadFromInfo(videoInfo, { format });

    const filename = 'video.mp4';
    const fileStream = fs.createWriteStream(filename);
    videoStream.pipe(fileStream);

    fileStream.on('finish', () => {
      zk.sendMessage(origineMessage, { video: { url: `./${filename}` }, caption: "*DRK_ST_V1* a téléchargé ta vidéo avec succès ! 🎉", gifPlayback: false }, { quoted: ms });
    });

    fileStream.on('error', (error) => {
      console.error('Erreur lors de l\'écriture du fichier vidéo :', error);
      repondre('Une erreur est survenue lors de l\'écriture du fichier vidéo. 😓');
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement de la vidéo :', error);
    repondre('Oups ! Une erreur est survenue pendant le téléchargement de la vidéo. 😟');
  }
});

// Commande pour télécharger un audio en MP3
zokou({
  nomCom: "ytmp3",
  categorie: "Download",
  reaction: "💿"
}, async (origineMessage, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  if (!arg[0]) {
    repondre("Insère un lien YouTube pour télécharger de l'audio.");
    return;
  }

  try {
    const topo = arg.join(" ");
    const audioStream = ytdl(topo, { filter: 'audioonly', quality: 'highestaudio' });

    const filename = 'audio.mp3';
    const fileStream = fs.createWriteStream(filename);
    audioStream.pipe(fileStream);

    fileStream.on('finish', () => {
      zk.sendMessage(origineMessage, { audio: { url: `./${filename}` }, mimetype: 'audio/mp4' }, { quoted: ms, ptt: false });
      console.log("Envoi du fichier audio terminé !");
    });

    fileStream.on('error', (error) => {
      console.error('Erreur lors de l\'écriture du fichier audio :', error);
      repondre('Une erreur est survenue lors de l\'écriture du fichier audio. 😔');
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'audio :', error);
    repondre('Oups ! Une erreur est survenue pendant le téléchargement de l\'audio. 😢');
  }
});
