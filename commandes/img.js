const { zokou } = require('../framework/zokou');
var gis = require('g-i-s');

zokou({
    nomCom: "img",
    categorie: "Search",
    reaction: "🖼"
},
async (dest, zk, commandeOptions) => {
    const { repondre, ms, arg } = commandeOptions;

    if (!arg[0]) {
        repondre('🔍 Vous devez préciser quel type d\'image vous recherchez !');
        return;
    }

    const searchTerm = arg.join(" ");
    repondre(`🔎 Recherche d'images pour: *${searchTerm}*...`);

    gis(searchTerm, envoiImage);

    function envoiImage(e, r) {
        if (e) {
            repondre("🚨 Oups, une erreur est survenue lors de la recherche d'images !");
        } else {
            if (r.length === 0) {
                repondre('⚠️ Aucune image trouvée pour votre recherche.');
            } else {
                repondre(`✨ Voici quelques images pour *${searchTerm}* :`);
                for (let a = 0; a < Math.min(r.length, 5); a++) {
                    zk.sendMessage(dest, { image: { url: r[a].url } }, { quoted: ms });
                }
            }
        }
    }
});
