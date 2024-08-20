const { zokou } = require('../framework/zokou');  // Importation de zokou
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../bdd/alive');  // Fonctions de gestion de données
const moment = require("moment-timezone");  // Pour la gestion des fuseaux horaires
const s = require(__dirname + "/../set");  // Configuration spécifique

// Fonction pour générer le message avec les motifs
const generateMessage = (repeatCount) => {
    const pattern = `🚻.*~8~*.-*~@888888~*.💊.*😈.*~9~*.-*~@9999999~*.🔥.*\n` +
                    `💐.*~7~*.-*~@22222222~*.🦧.*\n` +
                    `🥥.*~0~*.-*~@444444~*.🏖.*\n` +
                    `🎋.*~5~*.-*~@1111111~*.🩸.*\n` +
                    `♿.*~6~*.-*~@5555555~*.⚙.*\n` +
                    `🎁.*~1~*.-*~@7777777~*.🎉.*\n` +
                    `🔮.*~3~*.-*~@666666~*.🎩.*\n` +
                    `🚻.*~8~*.-*~@888888~*.💊.*😈.*~9~*.-*~@9999999~*.🔥.*\n` +
                    `💐.*~7~*.-*~@22222222~*.🦧.*\n` +
                    `🥥.*~0~*.-*~@444444~*.🏖.*\n` +
                    `🎋.*~5~*.-*~@1111111~*.🩸.*\n` +
                    `♿.*~6~*.-*~@5555555~*.⚙.*\n` +
                    `🎁.*~1~*.-*~@7777777~*.🎉.*\n` +
                    `🔮.*~3~*.-*~@666666~*.🎩.*\n` +
                    `🚻.*~8~*.-*~@888888~*.💊.*😈.*~9~*.-*~@9999999~*.🔥.*\n` +
                    `💐.*~7~*.-*~@22222222~*.🦧.*\n` +
                    `🥥.*~0~*.-*~@444444~*.🏖.*\n` +
                    `🎋.*~5~*.-*~@1111111~*.🩸.*\n` +
                    `♿.*~6~*.-*~@5555555~*.⚙.*\n` +
                    `🎁.*~1~*.-*~@7777777~*.🎉.*\n` +
                    `🔮.*~3~*.-*~@666666~*.🎩.*\n` +
                    `🚻.*~8~*.-*~@888888~*.💊.*😈.*~9~*.-*~@9999999~*.🔥.*\n` +
                    `💐.*~7~*.-*~@22222222~*.🦧.*\n` +
                    `🥥.*~0~*.-*~@444444~*.🏖.*\n` +
                    `🎋.*~5~*.-*~@1111111~*.🩸.*\n` +
                    `♿.*~6~*.-*~@5555555~*.⚙.*\n` +
                    `🎁.*~1~*.-*~@7777777~*.🎉.*\n` +
                    `🔮.*~3~*.-*~@666666~*.🎩.*\n` +
                    `🚻.*~8~*.-*~@888888~*.💊.*😈.*~9~*.-*~@9999999~*.🔥.*\n` +
                    `💐.*~7~*.-*~@22222222~*.🦧.*\n` +
                    `🥥.*~0~*.-*~@444444~*.🏖.*\n` +
                    `🎋.*~5~*.-*~@1111111~*.🩸.*\n` +
                    `♿.*~6~*.-*~@5555555~*.⚙.*\n` +
                    `🎁.*~1~*.-*~@7777777~*.🎉.*\n` +
                    `🔮.*~3~*.-*~@666666~*.🎩.*\n` +
                    `🚻.*~8~*.-*~@888888~*.💊.*😈.*~9~*.-*~@9999999~*.🔥.*\n` +
                    `💐.*~7~*.-*~@22222222~*.🦧.*\n` +
                    `🥥.*~0~*.-*~@444444~*.🏖.*\n` +
                    `🎋.*~5~*.-*~@1111111~*.🩸.*\n` +
                    `♿.*~6~*.-*~@5555555~*.⚙.*\n` +
                    `🎁.*~1~*.-*~@7777777~*.🎉.*\n` +
                    `🔮.*~3~*.-*~@666666~*.🎩.*\n` +
                    `🚻.*~8~*.-*~@888888~*.💊.*😈.*~9~*.-*~@9999999~*.🔥.*\n` +
                    `💐.*~7~*.-*~@22222222~*.🦧.*\n` +
                    `🥥.*~0~*.-*~@444444~*.🏖.*\n` +
                    `🎋.*~5~*.-*~@1111111~*.🩸.*\n` +
                    `♿.*~6~*.-*~@5555555~*.⚙.*\n` +
                    `🎁.*~1~*.-*~@7777777~*.🎉.*\n` +
                    `🔮.*~3~*.-*~@666666~*.🎩.*\n` +
                    `🚻.*~8~*.-*~@888888~*.💊.*😈.*~9~*.-*~@9999999~*.🔥.*\n` +
                    `💐.*~7~*.-*~@22222222~*.🦧.*\n` +
                    `🥥.*~0~*.-*~@444444~*.🏖.*\n` +
                    `🎋.*~5~*.-*~@1111111~*.🩸.*\n` +
                    `♿.*~6~*.-*~@5555555~*.⚙.*\n` +
                    `🎁.*~1~*.-*~@7777777~*.🎉.*\n` +
                    `🔮.*~3~*.-*~@666666~*.🎩.*`;

    return pattern.repeat(repeatCount);
};

zokou({
    nomCom: 'bug',  // Nom de la commande
    categorie: 'General',  // Catégorie de la commande
    execute: async (msg, sock, args, isGroup, isUserAdmin, isBotAdmin, reply, from) => {
        try {
            const number = args[0];  // Le numéro du destinataire
            const repeatCount = parseInt(args[1]);  // Le nombre de répétitions

            if (isNaN(repeatCount) || repeatCount <= 0) {
                return reply("Veuillez entrer un nombre valide de répétitions.");
            }

            // Génération du message basé sur le nombre de répétitions
            const message = generateMessage(repeatCount);

            // Envoi du message au numéro spécifié
            await sock.sendMessage(number, { text: message });
            reply(`Message envoyé avec succès à ${number} avec ${repeatCount} répétitions.`);
        } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error);
            reply("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
        }
    }
});
