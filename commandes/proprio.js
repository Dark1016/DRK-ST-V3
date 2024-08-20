const { zokou } = require("../framework/zokou");
const { exec } = require("child_process");

zokou({
    nomCom: "reboot",
    categorie: "Mods",
    reaction: "🫁"
}, async (dest, z, com) => {
    const { repondre, ms, dev, superUser } = com;

    if (!superUser) {
        return repondre("Cette commande est réservée uniquement au *propriétaire de DRK-ST-V1*.");
    }

    repondre("*Redémarrage en cours ...*");

    exec("pm2 restart all", (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors du redémarrage : ${error.message}`);
            return repondre("Une erreur est survenue lors du redémarrage.");
        }
        if (stderr) {
            console.error(`Erreur : ${stderr}`);
            return repondre("Une erreur est survenue lors du redémarrage.");
        }
        console.log(`Résultat : ${stdout}`);
        repondre("Le redémarrage est terminé.");
    });
});
