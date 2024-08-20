const { zokou } = require("../framework/zokou");
const axios = require('axios');
const traduire = require('../framework/traduction');

// Commande pour le jeu Pierre-Papier-Ciseaux
zokou({
    nomCom: "rps",
    categorie: "Games",
    reaction: "🕹️" // Emoji plus dynamique pour le jeu
  },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, ms, auteurMessage, auteurMsgRepondu, msgRepondu , arg , idBot } = commandeOptions;

    if (msgRepondu) {
        zk.sendMessage(origineMessage, {
            text: `@${auteurMessage.split('@')[0]} défie @${auteurMsgRepondu.split('@')[0]} à un jeu de Pierre-Papier-Ciseaux! 🎮
        Pour accepter le défi, tapez "oui"`,
            mentions: [auteurMessage, auteurMsgRepondu]
        });

        try {
            const repinv = await zk.awaitForMessage({
                sender: auteurMsgRepondu,
                chatJid: origineMessage,
                timeout: 30000 // 30 secondes
            });
            console.log(repinv);

            if (repinv.message.conversation.toLowerCase() === 'oui' || repinv.message.extendedTextMessage.text.toLowerCase() === 'oui') {
                let msg1 = `*Joueur 1 :* @${auteurMsgRepondu.split('@')[0]}
*Joueur 2 :* @${auteurMessage.split('@')[0]}

*Règles :* Le jeu commence maintenant ! Vous avez 1 minute chacun pour faire un choix en message privé. 🕒`;
                
                zk.sendMessage(origineMessage, { text: msg1, mentions: [auteurMessage, auteurMsgRepondu] });

                let msg2 = `Vous avez 3 choix :

                Pierre
                Papier
                Ciseaux
                
                Envoyez votre choix ! ✍️`;
                
                let players = [auteurMessage, auteurMsgRepondu];
                let choix = [];

                try {
                    for (const player of players) {
                        zk.sendMessage(origineMessage, { text: `@${player.split("@")[0]} Veuillez aller dans ce chat pour faire votre choix :
                        https://wa.me/${idBot.split('@')[0]}`, mentions: [player]});
                        zk.sendMessage(player, { text: msg2 });

                        const msgrecu = await zk.awaitForMessage({
                            sender: player,
                            chatJid: player,
                            timeout: 30000 // 30 secondes
                        });
                        console.log('Message reçu de ' + player);
                        console.log(msgrecu);

                        choix.push(msgrecu.message.extendedTextMessage.text.toLowerCase());
                    }

                    console.log(choix);
                    const choixPossibles = ["pierre", "papier", "ciseaux"];

                    const choixJoueur1 = choix[0];
                    const choixJoueur2 = choix[1];

                    if (!choixPossibles.includes(choixJoueur1) || !choixPossibles.includes(choixJoueur2)) {
                        zk.sendMessage(origineMessage, { text: `*Joueur 1 :* @${auteurMsgRepondu.split('@')[0]}
*Joueur 2 :* @${auteurMessage.split('@')[0]}

*Résultat :* L'un ou les deux choix ne sont pas valides. 😅`, mentions: [auteurMessage, auteurMsgRepondu] });
                    } else if (choixJoueur1 === choixJoueur2) {
                        zk.sendMessage(origineMessage, { text: `*Joueur 1 :* @${auteurMsgRepondu.split('@')[0]} a choisi *${choixJoueur2}*
*Joueur 2 :* @${auteurMessage.split('@')[0]} a choisi *${choixJoueur1}*

*Résultat :* Match nul! 🎉`, mentions: [auteurMessage, auteurMsgRepondu] });
                    } else if (
                        (choixJoueur1 === "pierre" && choixJoueur2 === "ciseaux") ||
                        (choixJoueur1 === "papier" && choixJoueur2 === "pierre") ||
                        (choixJoueur1 === "ciseaux" && choixJoueur2 === "papier")
                    ) {
                        zk.sendMessage(origineMessage, { text: `*Joueur 1 :* @${auteurMsgRepondu.split('@')[0]} a choisi *${choixJoueur2}*
*Joueur 2 :* @${auteurMessage.split('@')[0]} a choisi *${choixJoueur1}*

*Résultat :* @${auteurMsgRepondu.split('@')[0]} gagne! 🎉`, mentions: [auteurMessage, auteurMsgRepondu] });
                    } else {
                        zk.sendMessage(origineMessage, { text: `*Joueur 1 :* @${auteurMsgRepondu.split('@')[0]} a choisi *${choixJoueur2}*
*Joueur 2 :* @${auteurMessage.split('@')[0]} a choisi *${choixJoueur1}*

*Résultat :* @${auteurMessage.split('@')[0]} gagne! 🎉`, mentions: [auteurMessage, auteurMsgRepondu] });
                    }

                } catch (error) {
                    if (error.message === 'Timeout') {
                        zk.sendMessage(origineMessage, { text: `*Joueur 1 :* @${auteurMsgRepondu.split('@')[0]}
*Joueur 2 :* @${auteurMessage.split('@')[0]}

*Résultat :* Nos joueurs ont pris trop de temps pour décider 😅. Le jeu est annulé.`, mentions: [auteurMessage, auteurMsgRepondu] });
                    } else {
                        console.error(error);
                    }
                }

            } else {
                repondre('Invitation refusée. 😔');
            }

        } catch (error) {
            if (error.message === 'Timeout') {
                zk.sendMessage(origineMessage, { text: `@${auteurMsgRepondu.split('@')[0]} a mis trop de temps pour répondre à l'invitation de @${auteurMessage.split('@')[0]}. Le jeu est annulé.`, mentions: [auteurMessage, auteurMsgRepondu] });
            } else {
                console.error(error);
            }
        }
    } else {
        repondre('Chifumi est un jeu Pierre-Papier-Ciseaux; vous avez besoin d’un ami pour jouer. Mentionnez son message lorsque vous envoyez chifumi pour l’inviter. 🎮');
    }
});
const { zokou } = require("../framework/zokou");
const axios = require('axios');
const traduire = require('../framework/traduction');

// Commande pour le quiz
zokou({
    nomCom: "quizz",
    categorie: "Games",
    reaction: "🧠" // Emoji plus engageant pour le quiz
}, async (origineMessage, zk, commandeOptions) => {
    const { repondre, auteurMessage } = commandeOptions;

    try {
        let quizz = await axios.get("https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=1&difficulty=facile");

        let msg = `*Jeu de Quiz de DRK_ST_V3* 🧠

*Catégorie :* ${await traduire(quizz.data.quizzes[0].category, {to: 'en'})}
*Question :* ${await traduire(quizz.data.quizzes[0].question, {to: 'en'})}\n\n*Réponses :*\n`;

        let Answers = [];
        for (const reponse of quizz.data.quizzes[0].badAnswers) {
            Answers.push(reponse);
        }

        Answers.push(quizz.data.quizzes[0].answer);

        async function shuffleArray(array) {
            const shuffledArray = array.slice(); // Copie du tableau d'origine
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            return shuffledArray;
        }

        let choix = await shuffleArray(Answers);

        for (let i = 0; i < choix.length; i++) {
            msg += `*${i + 1} :* ${choix[i]}\n`;
        }

        msg += `
Envoyez le numéro de la bonne réponse! 🤔`;

        repondre(msg);

        let rep = await zk.awaitForMessage({
            sender: auteurMessage,
            chatJid: origineMessage,
            timeout: 15000 // 15 secondes
        });

        let repse;
        try {
            repse = rep.message.extendedTextMessage.text;
        } catch {
            repse = rep.message.conversation;
        }

        if (choix[repse - 1] === quizz.data.quizzes[0].answer) {
            repondre("Bravo, bonne réponse! 🎉");
        } else {
            repondre("Mauvaise réponse, essayez encore! 😅");
        }

    } catch (error) {
        console.log(error);
    }
});

