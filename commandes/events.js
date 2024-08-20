const { zokou } = require('../framework/zokou');
const { attribuerUnevaleur } = require('../bdd/welcome');

async function events(nomCom) {
    zokou({
        nomCom: nomCom,
        categorie: 'Groupe'
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser, verifAdmin } = commandeOptions;

        if (verifAdmin || superUser) {
            if (!arg[0] || arg.join(' ') === ' ') {
                repondre(`${nomCom} : Utilisez '${nomCom} on' pour activer et '${nomCom} off' pour désactiver.`);
            } else {
                if (arg[0] === 'on' || arg[0] === 'off') {
                    await attribuerUnevaleur(dest, nomCom, arg[0]);
                    repondre(`${nomCom} est maintenant ${arg[0] === 'on' ? 'activé' : 'désactivé'}.`);
                } else {
                    repondre('Utilisez "on" pour activer et "off" pour désactiver.');
                }
            }
        } else {
            repondre('Vous ne pouvez pas utiliser cette commande.');
        }
    });
}

// Appel de la fonction events pour les valeurs 'welcome' et 'goodbye'
events('welcome');
events('goodbye');
events('antipromote');
events('antidemote');
