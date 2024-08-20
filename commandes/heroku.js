const { zokou } = require('../framework/zokou');
const s = require('../set');

zokou(
    {
        nomCom: "setvar",
        categorie: "heroku vars",
        reaction: "🔥"
    },
    async (dest, zk, commandeOptions) => {
        const { ms, repondre, superUser, arg } = commandeOptions;
        
        if (!superUser) {
            repondre('👀 Seules les personnes avec une cape de supermodérateur peuvent utiliser cette commande ! 🌟');
            return;
        }
        if (!arg[0] || !(arg.join('').split('='))) {
            repondre('😵 Mauvais format ! Exemple de commande : `setvar OWNER_NAME=sten` 🚀');
            return;
        }
        
        const text = arg.join(" ");
        const Heroku = require("heroku-client");
        
        const heroku = new Heroku({
            token: s.HEROKU_APY_KEY,
        });

        let baseURI = "/apps/" + s.HEROKU_APP_NAME;
        await heroku.patch(baseURI + "/config-vars", {
            body: {
                [text.split('=')[0]]: text.split('=')[1],
            },
        });
        await repondre('🔥 Les variables Heroku ont été modifiées, redémarrage en cours... 🌪️');
    }
);

zokou(
    {
        nomCom: "getallvar",
        categorie: "heroku vars",
        reaction: "🔍"
    },
    async (dest, zk, commandeOptions) => {
        const { ms, repondre, superUser, arg } = commandeOptions;
        
        if (!superUser) {
            repondre('👀 Seules les personnes avec une cape de supermodérateur peuvent utiliser cette commande ! 🌟');
            return;
        }
        
        const Heroku = require("heroku-client");
        
        const heroku = new Heroku({
            token: s.HEROKU_APY_KEY,
        });
        let baseURI = "/apps/" + s.HEROKU_APP_NAME;
        
        let h = await heroku.get(baseURI + '/config-vars');
        let str = '*🚀 Variables de DRK_ST_V1🌟*\n\n';
        for (const vr in h) {
            str += '☉ *' + vr + '* = ' + h[vr] + '\n';
        }
        repondre(str);
    }
);

zokou(
    {
        nomCom: "getvar",
        categorie: "heroku vars",
        reaction: "🔍"
    },
    async (dest, zk, commandeOptions) => {
        const { ms, repondre, superUser, arg } = commandeOptions;
        
        if (!superUser) {
            repondre('👀 Seules les personnes avec une cape de supermodérateur peuvent utiliser cette commande ! 🌟');
            return;
        }
        if (!arg[0]) {
            repondre('📝 Insérez le nom de la variable en LETTRES MAJUSCULES !');
            return;
        }
        
        try {
            const Heroku = require("heroku-client");
            
            const heroku = new Heroku({
                token: s.HEROKU_APY_KEY,
            });
            let baseURI = "/apps/" + s.HEROKU_APP_NAME;
            let h = await heroku.get(baseURI + '/config-vars');
            for (const vr in h) {
                if (arg.join(' ') === vr) {
                    return repondre(vr + ' = ' + h[vr]);
                }
            }
            repondre('🔍 Variable introuvable ! Peut-être qu’elle se cache dans un autre univers... 🌌');
        } catch (e) {
            repondre('😱 Erreur : ' + e);
        }
    }
);
