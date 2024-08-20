const { france } = require('../framework/france');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

// Fonction principale pour gérer la recherche et le téléchargement de musique
france({
    nomCom: 'musique',
    categorie: 'Audio',
    reaction: '🎸'
}, async (messageOrigine, ab6d25, optionsCommande) => {
    const { ms: messageSource, repondre: repondre, arg: arguments } = optionsCommande;

    if (!arguments[0]) {
        repondre('Veuillez spécifier le nom de la chanson.');
        return;
    }

    try {
        // Recherche de la chanson sur YouTube
        let query = arguments.join(' ');
        const recherche = await yts(query);
        const videos = recherche.videos;

        if (videos && videos.length > 0) {
            const urlVideo = videos[0].url;
            const titre = videos[0].title;
            const thumbnail = videos[0].thumbnail;
            const duree = videos[0].timestamp;

            // Envoi des informations de la vidéo avant téléchargement
            let message = {
                image: { url: thumbnail },
                caption: `Titre de la chanson: ${titre}\nDurée: ${duree}\n\nTéléchargement en cours...`
            };
            ab6d25.sendMessage(messageOrigine, message, { quoted: messageSource });

            // Téléchargement de l'audio
            const audioStream = ytdl(urlVideo, { filter: 'audioonly', quality: 'highestaudio' });
            const fichierAudio = 'audio.mp3';
            const writeStream = fs.createWriteStream(fichierAudio);

            audioStream.pipe(writeStream);

            // Envoi de l'audio une fois téléchargé
            writeStream.on('finish', () => {
                ab6d25.sendMessage(messageOrigine, { audio: { url: fichierAudio }, mimetype: 'audio/mp4' }, { quoted: messageSource, ptt: false });
                console.log('Envoi du fichier audio terminé !');
            });

            // Gestion des erreurs lors de l'écriture du fichier audio
            writeStream.on('error', (erreur) => {
                console.error('Erreur lors de l\'écriture du fichier audio:', erreur);
                repondre('Une erreur est survenue lors de l\'écriture du fichier audio.');
            });
        } else {
            repondre('Aucune vidéo trouvée.');
        }
    } catch (erreur) {
        console.error('Erreur lors de la recherche ou du téléchargement de la vidéo:', erreur);
        repondre('Une erreur est survenue lors de la recherche ou du téléchargement de la vidéo.');
    }
});
