const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../bdd/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou(
    {
        nomCom: 'alive',
        categorie: 'General'
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser } = commandeOptions;

        const data = await getDataFromAlive();

        if (!arg || !arg[0] || arg.join('') === '') {
            if (data) {
                const { message, lien } = data;
                let mode = "public";
                if ((s.MODE).toLocaleLowerCase() !== "yes") {
                    mode = "private";
                }

                moment.tz.setDefault('Etc/GMT');
                const temps = moment().format('HH:mm:ss');
                const date = moment().format('DD/MM/YYYY');

                const alivemsg = `
*Owner* : ${s.OWNER_NAME}
*Mode* : ${mode}
*Date* : ${date}
*Hours (GMT)* : ${temps}

${message}

_TKM-bot_`;

                if (lien.match(/\.(mp4|gif)$/i)) {
                    try {
                        zk.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } catch (e) {
                        console.log("🥵🥵 Erreur lors de l'envoi de la vidéo : " + e);
                        repondre("🥵🥵 Erreur lors de l'envoi de la vidéo : " + e);
                    }
                } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                    try {
                        zk.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } catch (e) {
                        console.log("🥵🥵 Erreur lors de l'envoi de l'image : " + e);
                        repondre("🥵🥵 Erreur lors de l'envoi de l'image : " + e);
                    }
                } else {
                    repondre(alivemsg);
                }
            } else {
                if (!superUser) {
                    repondre("⚠️ Il n'y a pas de message 'alive' enregistré pour ce bot.");
                    return;
                }
                await repondre("📝 Vous n'avez pas encore enregistré votre message 'alive'. Pour ce faire, entrez après la commande '.alive' votre message suivi du lien de votre image ou vidéo dans le format suivant : .alive message;lien");
                repondre("🚫 Ne faites pas de fausses déclarations :)");
            }
        } else {
            if (!superUser) {
                repondre("🔒 Seul le propriétaire peut modifier le message 'alive'.");
                return;
            }

            const [texte, tlien] = arg.join(' ').split(';');

            await addOrUpdateDataInAlive(texte, tlien);

            repondre('✅ _*DRK_ST_V3*_. Le message 'alive' a été mis à jour.');
        }
    });
    