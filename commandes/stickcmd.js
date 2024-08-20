const { zokou } = require('../framework/zokou');
const { addstickcmd, deleteCmd, getCmdById, inStickCmd, getAllStickCmds } = require('../bdd/stickcmd');

// Définition de la commande 'setcmd' dans la catégorie 'stickcmd'
zokou(
    {
        nomCom: 'setcmd',
        categorie: 'stickcmd'
    },
    async (dest, zk, commandeOptions) => { 
        const { ms, arg, repondre, superUser, msgRepondu } = commandeOptions;

        // Vérifie si l'utilisateur est un super utilisateur
        if (!superUser) {
            repondre('Vous ne pouvez pas utiliser cette commande');
            return;
        }

        // Vérifie si un message avec un sticker a été répondu
        if (msgRepondu && msgRepondu.stickerMessage) {
            // Vérifie si le nom de la commande est fourni
            if (!arg || !arg[0]) {
                repondre('Veuillez fournir le nom de la commande');
                return;
            }
            
            // Ajoute la commande avec le sticker
            await addstickcmd(arg[0].toLowerCase(), msgRepondu.stickerMessage.url);
            repondre('Commande de sticker enregistrée avec succès');
        } else {
            repondre('Veuillez mentionner un sticker');
        }
    }
);

// Définition de la commande 'delcmd' dans la catégorie 'stickcmd'
zokou(
    {
        nomCom: 'delcmd',
        categorie: 'stickcmd'
    },
    async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser } = commandeOptions;

        // Vérifie si l'utilisateur est un super utilisateur
        if (!superUser) {
            repondre('Seuls les Modérateurs peuvent utiliser cette commande');
            return;
        }

        // Vérifie si le nom de la commande à supprimer est fourni
        if (!arg || !arg[0]) {
            repondre('Veuillez fournir le nom de la commande que vous souhaitez supprimer');
            return;
        }

        const cmdToDelete = arg[0];

        try {
            // Supprime la commande
            await deleteCmd(cmdToDelete.toLowerCase());
            repondre(`La commande ${cmdToDelete} a été supprimée avec succès.`);
        } catch {
            repondre(`La commande ${cmdToDelete} n'existe pas`);
        }
    }
);

// Définition de la commande 'allcmd' dans la catégorie 'stickcmd'
zokou(
    {
        nomCom: 'allcmd',
        categorie: 'stickcmd'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, superUser } = commandeOptions;

        // Vérifie si l'utilisateur est un super utilisateur
        if (!superUser) {
            repondre('Seuls les Modérateurs peuvent utiliser cette commande');
            return;
        }

        // Récupère toutes les commandes de stickers
        const allCmds = await getAllStickCmds();

        if (allCmds.length > 0) {
            // Crée une liste des commandes
            const cmdList = allCmds.map(cmd => cmd.cmd).join(', ');
            repondre(`*Liste de toutes les commandes de stickers :*\n${cmdList}`);
        } else {
            repondre('Aucune commande de sticker enregistrée');
        }
    }
);

