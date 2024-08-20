const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { zokou } = require("../framework/zokou");
const traduire = require("../framework/traduction");
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const axios = require('axios');
const FormData = require('form-data');
const { exec } = require("child_process");

// Fonction pour uploader sur Telegraph
async function uploadToTelegraph(Path) {
  if (!fs.existsSync(Path)) {
    throw new Error("Fichier non existant");
  }

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(Path));

    const { data } = await axios.post("https://telegra.ph/upload", form, {
      headers: { ...form.getHeaders() },
    });

    if (data && data[0] && data[0].src) {
      return "https://telegra.ph" + data[0].src;
    } else {
      throw new Error("Erreur lors de la récupération du lien de la vidéo");
    }
  } catch (err) {
    throw new Error(String(err));
  }
}

// Commande pour créer un sticker à partir d'une image ou d'une vidéo
zokou({ nomCom: "sticker", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
  const { ms, mtype, arg, repondre, nomAuteurMessage } = commandeOptions;

  let mime = mtype === "imageMessage" || mtype === "videoMessage";
  let tagImage = mtype === "extendedTextMessage" && JSON.stringify(ms.message).includes("imageMessage");
  let tagVideo = mtype === "extendedTextMessage" && JSON.stringify(ms.message).includes("videoMessage");

  const alea = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;
  const stickerFileName = alea(".webp");

  try {
    let mediaPath;
    if (mtype === "imageMessage" || tagImage) {
      mediaPath = ms.message.imageMessage || ms.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
    } else if (mtype === "videoMessage" || tagVideo) {
      mediaPath = ms.message.videoMessage || ms.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
    } else {
      repondre("Please mention an image or video!");
      return;
    }

    const media = await downloadContentFromMessage(mediaPath, mtype === "videoMessage" ? "video" : "image");
    let buffer = Buffer.concat(await Promise.all([...media]));
    
    const sticker = new Sticker(buffer, {
      pack: "Zokou-Md",
      author: nomAuteurMessage,
      type: arg.includes("crop") || arg.includes("c") ? StickerTypes.CROPPED : StickerTypes.FULL,
      quality: mtype === "videoMessage" ? 40 : 100,
    });

    await sticker.toFile(stickerFileName);
    await zk.sendMessage(origineMessage, { sticker: fs.readFileSync(stickerFileName) }, { quoted: ms });
    
  } catch (error) {
    console.error(`Erreur lors de la création du sticker :`, error);
  } finally {
    try {
      fs.unlinkSync(stickerFileName);
    } catch (e) {
      console.error('Erreur lors de la suppression du fichier temporaire :', e);
    }
  }
});

// Commande pour créer un sticker recadré
zokou({ nomCom: "scrop", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
  const { ms, msgRepondu, arg, repondre, nomAuteurMessage } = commandeOptions;

  if (!msgRepondu) {
    repondre('Make sure to mention the media');
    return;
  }

  const pack = arg.length ? arg.join(' ') : nomAuteurMessage;
  const mediaType = msgRepondu.imageMessage ? "imageMessage" : msgRepondu.videoMessage ? "videoMessage" : msgRepondu.stickerMessage ? "stickerMessage" : null;
  
  if (!mediaType) {
    repondre('Uh, media please');
    return;
  }

  try {
    const mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu[mediaType]);
    const sticker = new Sticker(mediaPath, {
      pack: pack,
      type: StickerTypes.CROPPED,
      categories: ["🤩", "🎉"],
      id: "12345",
      quality: 70,
      background: "transparent",
    });
    const stickerBuffer = await sticker.toBuffer();
    await zk.sendMessage(origineMessage, { sticker: stickerBuffer }, { quoted: ms });
  } catch (error) {
    console.error('Erreur lors de la création du sticker recadré :', error);
    repondre('An error occurred while creating the sticker.');
  }
});

// Commande pour créer un sticker complet
zokou({ nomCom: "take", categorie: "Conversion", reaction: "🤫" }, async (origineMessage, zk, commandeOptions) => {
  const { ms, msgRepondu, arg, repondre, nomAuteurMessage } = commandeOptions;

  if (!msgRepondu) {
    repondre('Make sure to mention the media');
    return;
  }

  const pack = arg.length ? arg.join(' ') : nomAuteurMessage;
  const mediaType = msgRepondu.imageMessage ? "imageMessage" : msgRepondu.videoMessage ? "videoMessage" : msgRepondu.stickerMessage ? "stickerMessage" : null;
  
  if (!mediaType) {
    repondre('Uh, media please');
    return;
  }

  try {
    const mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu[mediaType]);
    const sticker = new Sticker(mediaPath, {
      pack: pack,
      type: StickerTypes.FULL,
      categories: ["🤩", "🎉"],
      id: "12345",
      quality: 70,
      background: "transparent",
    });
    const stickerBuffer = await sticker.toBuffer();
    await zk.sendMessage(origineMessage, { sticker: stickerBuffer }, { quoted: ms });
  } catch (error) {
    console.error('Erreur lors de la création du sticker complet :', error);
    repondre('An error occurred while creating the sticker.');
  }
});

// Commande pour ajouter du texte à une image
zokou({ nomCom: "write", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
  const { ms, msgRepondu, arg, repondre, nomAuteurMessage } = commandeOptions;

  if (!msgRepondu) {
    repondre('Please mention an image');
    return;
  }

  if (!msgRepondu.imageMessage) {
    repondre('The command only works with images');
    return;
  }

  const text = arg.join(' ');
  if (!text) {
    repondre('Make sure to insert text');
    return;
  }

  try {
    const imagePath = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    const clientId = 'b40a1820d63cd4e'; // Remplacez par votre client ID Imgur
    const headers = {
      'Authorization': `Client-ID ${clientId}`,
      ...form.getHeaders()
    };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.imgur.com/3/image',
      headers: headers,
      data: form
    };

    const response = await axios(config);
    const imageUrl = response.data.data.link;
    const memeUrl = `https://api.memegen.link/images/custom/-/${text}.png?background=${imageUrl}`;

    const sticker = new Sticker(memeUrl, {
      pack: nomAuteurMessage,
      author: '𝙎-𝙏𝞢𝞜',
      type: StickerTypes.FULL,
      categories: ["🤩", "🎉"],
      id: "12345",
      quality: 70,
      background: "transparent",
    });

    const stickerBuffer = await sticker.toBuffer();
    await zk.sendMessage(origineMessage, { sticker: stickerBuffer }, { quoted: ms });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du texte à l\'image :', error);
    repondre('An error occurred while creating the meme.');
  }
});

// Commande pour convertir un sticker en image
zokou({ nomCom: "photo", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (dest, zk, commandeOptions) => {
  const { ms, msgRepondu, repondre } = commandeOptions;

  if (!msgRepondu) {
    repondre('Make sure to mention the media');
    return;
  }

  const mediaType = msgRepondu.stickerMessage ? "stickerMessage" : null;
  
  if (!mediaType) {
    repondre('Uh, media please');
    return;
  }

  try {
    const stickerPath = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
    const outputImagePath = `${Date.now()}.png`;

    exec(`convert ${stickerPath} ${outputImagePath}`, (error) => {
      if (error) {
        console.error('Erreur lors de la conversion du sticker en image :', error);
        repondre('An error occurred while converting the sticker.');
        return;
      }

      fs.readFile(outputImagePath, (err, data) => {
        if (err) {
          console.error('Erreur lors de la lecture du fichier image :', err);
          repondre('An error occurred while reading the image.');
          return;
        }

        zk.sendMessage(dest, { image: data }, { quoted: ms });
        fs.unlinkSync(outputImagePath); // Supprime l'image après l'envoi
      });
    });
  } catch (error) {
    console.error('Erreur lors de la conversion du sticker en image :', error);
    repondre('An error occurred while converting the sticker.');
  }
});
