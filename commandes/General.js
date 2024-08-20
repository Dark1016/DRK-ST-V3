const { zokou } = require("../framework/zokou");
const { getAllSudoNumbers, isSudoTableNotEmpty } = require("../bdd/sudo");
const conf = require("../set");

zokou({ nomCom: "𝙎-𝙏𝞢𝞜", categorie: "General", reaction: "💌" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const thsudo = await isSudoTableNotEmpty();

    if (thsudo) {
        let msg = `*Mon Super-Utilisateur*\n\n*Numéro du Propriétaire :* - 🌟 @${conf.NUMERO_OWNER}\n\n------ *Autres Sudos* -----\n`;

        let sudos = await getAllSudoNumbers();

        for (const sudo of sudos) {
            if (sudo) { // Vérification plus stricte pour éliminer les valeurs vides ou indéfinies
                sudonumero = sudo.replace(/[^0-9]/g, '');
                msg += `- 💼 @${sudonumero}\n`;
            } else {
                return;
            }
        }

        const ownerjid = conf.NUMERO_OWNER.replace(/[^0-9]/g) + "@s.whatsapp.net";
        const mentionedJid = sudos.concat([ownerjid]);

        console.log(sudos);
        console.log(mentionedJid);

        zk.sendMessage(dest, {
            image: { url: mybotpic() },
            caption: msg,
            mentions: mentionedJid
        });
    } else {
        const vcard =
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'FN:' + conf.OWNER_NAME + '\n' +
            'ORG:undefined;\n' +
            'TEL;type=CELL;type=VOICE;waid=' + conf.NUMERO_OWNER + ':+' + conf.NUMERO_OWNER + '\n' +
            'END:VCARD';

        zk.sendMessage(dest, {
            contacts: {
                displayName: conf.OWNER_NAME,
                contacts: [{ vcard }],
            },
        }, { quoted: ms });
    }
});

zokou({ nomCom: "dev", categorie: "General", reaction: "💞" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const devs = [
        { nom: "𝙎-𝙏𝞢𝞜", numero: "50931461936" },
        // Ajoute d'autres développeurs ici avec leur nom et numéro
    ];

    let message = "Yowaimo!!!👋 bienvenue dans *: DRK_ST_V3* ! Voici les développeurs :\n\n";

    for (const dev of devs) {
        message += `----------------\n• ${dev.nom} : https://wa.me/${dev.numero}\n`;
    }

    var lien = mybotpic();

    if (lien.match(/\.(mp4|gif)$/i)) {
        try {
            zk.sendMessage(dest, { video: { url: lien }, caption: message }, { quoted: ms });
        } catch (e) {
            console.log("🥵🥵 Erreur du menu " + e);
            repondre("🥵🥵 Erreur du menu " + e);
        }
    } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        try {
            zk.sendMessage(dest, { image: { url: lien }, caption: message }, { quoted: ms });
        } catch (e) {
            console.log("🥵🥵 Erreur du menu " + e);
            repondre("🥵🥵 Erreur du menu " + e);
        }
    } else {
        repondre(lien);
        repondre("Erreur de lien");
    }
});

zokou({ nomCom: "support", categorie: "General" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions;

    repondre("Regardez en message privé, s'il vous plaît.");

    await zk.sendMessage(auteurMessage, { text: `https://whatsapp.com/channel/0029Vakp0UnICVfe3I2Fe72w` }, { quoted: ms });
});
