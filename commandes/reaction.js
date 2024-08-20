const axios = require('axios');
const { zokou } = require("../framework/zokou");
const fs = require("fs-extra");
const { exec } = require("child_process");
const child_process = require('child_process');
const { unlink } = require('fs').promises;

// Fonction sleep
const sleep = (ms) => {
    return new Promise((resolve) => { setTimeout(resolve, ms); });
};

// Fonction pour la conversion de GIF en vidéo et récupération du buffer vidéo
const GIFBufferToVideoBuffer = async (image) => {
    const filename = `${Math.random().toString(36)}`;
    await fs.writeFileSync(`./${filename}.gif`, image);
    
    await new Promise((resolve, reject) => {
        child_process.exec(
            `ffmpeg -i ./${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ./${filename}.mp4`,
            (error) => {
                if (error) reject(error);
                else resolve();
            }
        );
    });

    await sleep(4000);

    const videoBuffer = await fs.readFileSync(`./${filename}.mp4`);
    await Promise.all([unlink(`./${filename}.mp4`), unlink(`./${filename}.gif`)]);

    return videoBuffer;
};

// Fonction pour générer une commande de réaction
const generateReactionCommand = (reactionName, reactionEmoji) => {
    zokou({
        nomCom: reactionName,
        categorie: "Reaction",
        reaction: reactionEmoji,
    },
    async (origineMessage, zk, commandeOptions) => {
        const { auteurMessage, auteurMsgRepondu, repondre, ms, msgRepondu } = commandeOptions;

        const url = `https://api.waifu.pics/sfw/${reactionName}`;
        try {
            const response = await axios.get(url);
            const imageUrl = response.data.url;

            // Obtenir le buffer du GIF
            const gifBufferResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const gifBuffer = gifBufferResponse.data;

            // Convertir le GIF en vidéo et obtenir le buffer vidéo
            const videoBuffer = await GIFBufferToVideoBuffer(gifBuffer);

            // Envoyer la vidéo avec Zokou
            const txt = msgRepondu
                ? `@${auteurMessage.split("@")[0]} ${reactionName} @${auteurMsgRepondu.split("@")[0]}`
                : `@${auteurMessage.split("@")[0]} ${reactionName} everyone`;

            const videoMessage = {
                video: videoBuffer,
                gifPlayback: true,
                caption: txt,
                mentions: msgRepondu ? [auteurMessage, auteurMsgRepondu] : [auteurMessage]
            };

            zk.sendMessage(origineMessage, videoMessage, { quoted: ms });

        } catch (error) {
            repondre('Erreur lors de la récupération des données : ' + error.message);
            console.log(error);
        }
    });
};

// Définir les commandes de réaction
generateReactionCommand("bully", "👊");
generateReactionCommand("cuddle", "🤗");
generateReactionCommand("cry", "😢");
generateReactionCommand("hug", "😊");
generateReactionCommand("awoo", "🐺");
generateReactionCommand("kiss", "😘");
generateReactionCommand("lick", "👅");
generateReactionCommand("pat", "👋");
generateReactionCommand("smug", "😏");
generateReactionCommand("bonk", "🔨");
generateReactionCommand("yeet", "🚀");
generateReactionCommand("blush", "😊");
generateReactionCommand("smile", "😄");
generateReactionCommand("wave", "👋");
generateReactionCommand("highfive", "🖐");
generateReactionCommand("handhold", "🤝");
generateReactionCommand("nom", "👅");
generateReactionCommand("bite", "🦷");
generateReactionCommand("glomp", "🤗");
generateReactionCommand("slap", "👋");
generateReactionCommand("kill", "💀");
generateReactionCommand("kick", "🦵");
generateReactionCommand("happy", "😄");
generateReactionCommand("wink", "😉");
generateReactionCommand("poke", "👉");
generateReactionCommand("dance", "💃");
generateReactionCommand("cringe", "😬");
