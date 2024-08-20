const { zokou } = require("../framework/zokou");
const fancy = require("../commandes/style");

// Configuration de la commande 'fancy'
zokou({ nomCom: "fancy", categorie: "Fun", reaction: "✔️" }, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe } = commandeOptions;
    const id = arg[0]?.match(/\d+/)?.join('');
    const text = arg.slice(1).join(" ");

    try {
        if (id === undefined || text === undefined) {
            return await repondre(`\nExemple : ${prefixe}fancy 24 Gojou-md\n` + String.fromCharCode(8206).repeat(4001) + fancy.list('DRK_ST_V3', fancy));
        }

        const selectedStyle = fancy[parseInt(id) - 1];
        if (selectedStyle) {
            return await repondre(fancy.apply(selectedStyle, text));
        } else {
            return await repondre('_Style introuvable 😅_');
        }
    } catch (error) {
        console.error(error);
        return await repondre('_Oups, une erreur est survenue 😵‍💫_');
    }
});
