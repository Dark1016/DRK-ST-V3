const { zokou } = require("../framework/zokou");
const afkfunc = require("../bdd/afk");

zokou({
    nomCom: 'afk',
    categorie: 'Mods',
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        repondre('🚫 Vous n\'avez pas la permission d\'utiliser cette commande ! 🚫');
        return;
    }

    if (!arg[0]) {
        let result = await afkfunc.changeAfkState(1, "on");

        if (result === "not defined") {
            repondre("💡 Vous n'avez pas mis à jour le paramètre pour AFK (Away From Keyboard). \nPour enregistrer un message AFK, entrez un message après la commande, puis un lien d'image (le lien est optionnel). 📸");
        } else {
            await afkfunc.changeAfkState(1, "on");
            repondre("✅ Le message AFK a été activé avec succès !");
        }
    } else {
        try {
            let text = [];
            let url = "no url";

            arg.forEach(element => {
                if (element.endsWith(".jpg") || element.endsWith(".png") || element.endsWith(".jpeg")) {
                    url = element;
                } else if (element !== undefined) {
                    text.push(element);
                }
            });

            await afkfunc.addOrUpdateAfk(1, text.join(" "), url);
            repondre("📥 Le message AFK a été enregistré ! Tapez à nouveau la commande AFK pour l'activer. 🚀");
        } catch (error) {
            console.log(error);
            repondre("⚠️ Une erreur est survenue lors de l'enregistrement de l'AFK. Veuillez réessayer.");
        }
    }
});
