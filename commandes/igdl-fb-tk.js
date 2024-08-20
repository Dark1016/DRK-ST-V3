const { zokou } = require('../framework/zokou');
const fs = require('fs');
const getFBInfo = require("@xaviabot/fb-downloader");
const { default: axios } = require('axios');

// Commande pour télécharger des vidéos Instagram
zokou(
    {
        nomCom: "igdl",
        categorie: "Download",
        reaction: "📸"
    },
    async (dest, zk, commandeOptions) => {
        const { ms, repondre, arg } = commandeOptions;
        let link = arg.join(' ');

        if (!arg[0]) {
            repondre('😕 Veuillez insérer un lien de vidéo Instagram ! 📷');
            return;
        }

        try {
            let igvid = await axios('http://api.maher-zubair.tech/download/instagram?url=' + link);

            try {
                // Envoi d'une vidéo si disponible
                zk.sendMessage(dest, { video: { url: igvid.data.result[0].url }, caption: "📸 Vidéo Instagram téléchargée par *Gojou-md* 🚀", gifPlayback: false }, { quoted: ms });
            } catch (e) {
                // Envoi d'une image si la vidéo échoue
                zk.sendMessage(dest, { image: { url: igvid.data.result[0].url }, caption: "📸 Image Instagram téléchargée par *Gojou-md* 🎉" });
            }
        } catch (e) {
            repondre("🚨 Erreur lors du téléchargement : " + e);
        }
    }
);

// Commande pour télécharger des vidéos Facebook
zokou(
    {
        nomCom: "fbdl",
        categorie: "Download",
        reaction: "📽️"
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, ms, arg } = commandeOptions;

        if (!arg[0]) {
            repondre('📢 Insérez un lien de vidéo Facebook public, s\'il vous plaît ! 🎬');
            return;
        }

        const queryURL = arg.join(" ");

        try {
            getFBInfo(queryURL)
                .then((result) => {
                    let caption = `
Titre: ${result.title}
Lien: ${result.url}
                    `;
                    zk.sendMessage(dest, { image: { url: result.thumbnail }, caption: caption }, { quoted: ms });
                    zk.sendMessage(dest, { video: { url: result.hd }, caption: '📽️ Vidéo Facebook téléchargée par *Gojou-md* 🎉' }, { quoted: ms });
                })
                .catch((error) => {
                    console.log("Erreur:", error);
                    repondre('😵 Essayez la commande `fbdl2` pour ce lien !');
                });
        } catch (error) {
            console.error('Erreur lors du téléchargement de la vidéo :', error);
            repondre('😱 Erreur lors du téléchargement de la vidéo : ' + error);
        }
    }
);

// Commande pour télécharger des vidéos TikTok
zokou(
    {
        nomCom: "tiktok",
        categorie: "Download",
        reaction: "🎵"
    },
    async (dest, zk, commandeOptions) => {
        const { arg, ms, prefixe, repondre } = commandeOptions;

        if (!arg[0]) {
            repondre(`🎯 Comment utiliser cette commande :\n ${prefixe}tiktok tiktok_video_link`);
            return;
        }

        const videoUrl = arg.join(" ");

        try {
            let data = await axios.get('http://api.maher-zubair.tech/download/tiktok2?url=' + videoUrl);
            let tik = data.data.result;
            const caption = `Titre: ${tik.title}`;
            zk.sendMessage(dest, { video: { url: tik.video[0] }, caption: caption }, { quoted: ms });
        } catch (e) {
            repondre('🛑 Erreur lors du téléchargement de la vidéo TikTok : ' + e);
        }
    }
);

// Commande pour télécharger des vidéos Facebook (alternative)
zokou(
    {
        nomCom: "fbdl2",
        categorie: "Download",
        reaction: "📽️"
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, ms, arg } = commandeOptions;

        if (!arg[0]) {
            repondre('📢 Insérez un lien de vidéo Facebook public, s\'il vous plaît ! 🎬');
            return;
        }

        const queryURL = arg.join(" ");

        try {
            getFBInfo(queryURL)
                .then((result) => {
                    let caption = `
Titre: ${result.title}
Lien: ${result.url}
                    `;
                    zk.sendMessage(dest, { image: { url: result.thumbnail }, caption: caption }, { quoted: ms });
                    zk.sendMessage(dest, { video: { url: result.sd }, caption: '📽️ Vidéo Facebook téléchargée (version SD) par *Gojou-md* 🚀' }, { quoted: ms });
                })
                .catch((error) => {
                    console.log("Erreur:", error);
                    repondre('😕 Quelque chose a mal tourné... Vérifiez le lien ou essayez à nouveau.');
                });
        } catch (error) {
            console.error('Erreur lors du téléchargement de la vidéo :', error);
            repondre('😱 Erreur lors du téléchargement de la vidéo : ' + error);
        }
    }
);
