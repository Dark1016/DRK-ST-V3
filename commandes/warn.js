const { zokou } = require('../framework/zokou');
const { ajouterUtilisateurAvecWarnCount, getWarnCountByJID, resetWarnCountByJID } = require('../bdd/warn');
const s = require("../set");

zokou(
    {
        nomCom: 'warn',
        categorie: 'Group'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser, verifGroupe, verifAdmin, msgRepondu, auteurMsgRepondu } = commandeOptions;

        if (!verifGroupe) {
            return repondre('Cette commande est réservée aux groupes, pas aux solitaires ! 🚫');
        }

        if (verifAdmin || superUser) {
            if (!msgRepondu) {
                return repondre('Il faut répondre à un message utilisateur pour appliquer un avertissement ! 📩');
            }

            if (!arg || !arg[0] || arg.join('') === '') {
                await ajouterUtilisateurAvecWarnCount(auteurMsgRepondu);
                let warn = await getWarnCountByJID(auteurMsgRepondu);
                let warnlimit = s.WARN_COUNT;

                if (warn >= warnlimit) {
                    await repondre('Avertissement maximum atteint ! 🛑 L’utilisateur va être expulsé.');
                    await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
                } else {
                    let reste = warnlimit - warn;
                    return repondre(`Avertissement appliqué ! Reste avant l’expulsion : ${reste} ⚠️`);
                }
            } else if (arg[0] === 'reset') {
                await resetWarnCountByJID(auteurMsgRepondu);
                return repondre("Le compte d'avertissements a été réinitialisé pour cet utilisateur. 🌟");
            } else {
                return repondre('Pour avertir un utilisateur, répondez à son message avec `.warn`. Pour réinitialiser, utilisez `.warn reset`. 📝');
            }
        } else {
            return repondre('Désolé, seuls les administrateurs peuvent utiliser cette commande ! 🚫');
        }

    });
    