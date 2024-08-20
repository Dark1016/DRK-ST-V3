const { zokou } = require("../framework/zokou");
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require("fluent-ffmpeg");

// Commande play
zokou({
  nomCom: "play",
  categorie: "Search",
  reaction: "💿"
}, async (origineMessage, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  if (!arg[0]) {
    repondre("Quelle chanson veux-tu écouter ? 🎵");
    return;
  }

  try {
    let topo = arg.join(" ");
    const search = await yts(topo);
    const videos = search.videos;

    if (videos && videos.length > 0 && videos[0]) {
      const urlElement = videos[0].url;
      let infoMess = {
        image: { url: videos[0].thumbnail },
        caption: `🎶 *Gojou-md* est prêt à jouer ta chanson ! 🎶\n\n*Nom de la chanson* : _${videos[0].title}_\n*Durée* : _${videos[0].timestamp}_\n*URL* : _${videos[0].url}_\n\n*Téléchargement en cours...* 🚀`
      };

      zk.sendMessage(origineMessage, infoMess, { quoted: ms });
      
      // Obtenir le flux audio de la vidéo
      const audioStream = ytdl(urlElement, { filter: 'audioonly', quality: 'highestaudio' });

      // Nom du fichier local pour sauvegarder le fichier audio
      const filename = 'audio.mp3';

      // Écrire le flux audio dans un fichier local
      const fileStream = fs.createWriteStream(filename);
      audioStream.pipe(fileStream);

      fileStream.on('finish', () => {
        // Envoi du fichier audio
        zk.sendMessage(origineMessage, { audio: { url: "audio.mp3" }, mimetype: 'audio/mp4' }, { quoted: ms, ptt: false });
        console.log("Le fichier audio est prêt à être envoyé !");
      });

      fileStream.on('error', (error) => {
        console.error('Erreur lors de l\'écriture du fichier audio :', error);
        repondre('Oups ! Un problème est survenu lors de l\'écriture du fichier audio. 😕');
      });
    } else {
      repondre('Aucune vidéo trouvée. Peut-être essaie une autre chanson ? 🎤');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ou du téléchargement de la vidéo :', error);
    repondre('Oups ! Un problème est survenu pendant la recherche ou le téléchargement de la vidéo. 😓');
  }
});

// Commande video
zokou({
  nomCom: "video",
  categorie: "Search",
  reaction: "🎥"
}, async (origineMessage, zk, commandeOptions) => {
  const { arg, ms, repondre } = commandeOptions;

  if (!arg[0]) {
    repondre("Quel vidéo cherches-tu ? 🎬");
    return;
  }

  const topo = arg.join(" ");
  try {
    const search = await yts(topo);
    const videos = search.videos;

    if (videos && videos.length > 0 && videos[0]) {
      const Element = videos[0];

      let InfoMess = {
        image: { url: videos[0].thumbnail },
        caption: `🎥 *DRK_ST_V1* est en train de récupérer ta vidéo ! 🎥\n\n*Nom de la vidéo* : _${Element.title}_\n*Durée* : _${Element.timestamp}_\n*URL* : _${Element.url}_\n\n*Téléchargement en cours...* 🎬`
      };

      zk.sendMessage(origineMessage, InfoMess, { quoted: ms });

      // Obtenir les informations de la vidéo à partir du lien YouTube
      const videoInfo = await ytdl.getInfo(Element.url);
      // Format vidéo avec la meilleure qualité disponible
      const format = ytdl.chooseFormat(videoInfo.formats, { quality: '18' });
      // Télécharger la vidéo
      const videoStream = ytdl.downloadFromInfo(videoInfo, { format });

      // Nom du fichier local pour sauvegarder la vidéo
      const filename = 'video.mp4';

      // Écrire le flux vidéo dans un fichier local
      const fileStream = fs.createWriteStream(filename);
      videoStream.pipe(fileStream);

      fileStream.on('finish', () => {
        // Envoi du fichier vidéo
        zk.sendMessage(origineMessage, { video: { url: "./video.mp4" }, caption: "📹 Voici ta vidéo, générée par *: DRK_ST_V1* ! 📹", gifPlayback: false }, { quoted: ms });
      });

      fileStream.on('error', (error) => {
        console.error('Erreur lors de l\'écriture du fichier vidéo :', error);
        repondre('Oups ! Un problème est survenu lors de l\'écriture du fichier vidéo. 😕');
      });
    } else {
      repondre('Aucune vidéo trouvée. Essaye avec un autre titre ! 🎥');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ou du téléchargement de la vidéo :', error);
    repondre('Oups ! Un problème est survenu pendant la recherche ou le téléchargement de la vidéo. 😓');
  }
});
