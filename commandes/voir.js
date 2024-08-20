const { zokou } = require("../framework/zokou");

zokou({ nomCom: "vv", categorie: "General", reaction: "🤳" }, async (dest, zk, commandeOptions) => {

    const { ms, msgRepondu, repondre } = commandeOptions;

    if (!msgRepondu) {
        return repondre("On va se calmer, il faut mentionner un message visible une fois ! 🚨");
    }

    if (msgRepondu.viewOnceMessageV2) {
        if (msgRepondu.viewOnceMessageV2.message.imageMessage) {
            var image = await zk.downloadAndSaveMediaMessage(msgRepondu.viewOnceMessageV2.message.imageMessage);
            var texte = msgRepondu.viewOnceMessageV2.message.imageMessage.caption;
            
            await zk.sendMessage(dest, { image: { url: image }, caption: texte }, { quoted: ms });
            return repondre("Boom! L'image est renvoyée comme une étoile filante ✨.");
        } else if (msgRepondu.viewOnceMessageV2.message.videoMessage) {
            var video = await zk.downloadAndSaveMediaMessage(msgRepondu.viewOnceMessageV2.message.videoMessage);
            var texte = msgRepondu.viewOnceMessageV2.message.videoMessage.caption;
            
            await zk.sendMessage(dest, { video: { url: video }, caption: texte }, { quoted: ms });
            return repondre("Vidéo capturée et envoyée ! 🎥 Voilà du contenu de qualité.");
        }
    } else {
        return repondre("Ce message n'est pas visible une seule fois, désolé ! 🚫 Essayons encore.");
    }
});
