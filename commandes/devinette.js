const { zokou } = require('../framework/zokou');

// Liste des devinettes avec questions et réponses
const devinettes = [
  {
    question: "Je peux voler sans ailes, qui suis-je ?",
    reponse: "Le vent",
  },
  {
    question: "Je suis toujours affamé, plus je mange, plus je deviens gros. Qui suis-je ?",
    reponse: "Un trou noir",
  },
  {
    question: "Je suis fort quand je suis à terre, mais faible quand je suis en l'air. Qui suis-je ?",
    reponse: "Le chiffre 6",
  },
  {
    question: "Je peux être court ou long, dur ou mou, je peux être utilisé par n'importe qui, des jeunes enfants aux musiciens expérimentés. Qui suis-je ?",
    reponse: "Un crayon",
  },
  {
    question: "Je suis le début de la fin, la fin de chaque endroit. Je suis le début de l'éternité, la fin du temps et de l'espace. Qui suis-je ?",
    reponse: "La lettre 'e'",
  },
  {
    question: "Je suis blanc quand je suis sale et noir quand je suis propre. Qui suis-je ?",
    reponse: "Une ardoise",
  },
  {
    question: "Je suis liquide, mais si tu m'enlèves de l'eau, je deviens solide. Qui suis-je ?",
    reponse: "Le thé",
  },
  {
    question: "Je suis le propriétaire et créateur du bot DRK_ST_V3 et de nombreux autres, j'ai aussi un canal WhatsApp. Qui suis-je ?",
    reponse: "S-TEN",
  },
  {
    question: "Je vole sans ailes, je pleure sans yeux. Partout où je vais, la mort m'accompagne toujours. Qui suis-je ?",
    reponse: "Le vent",
  },
  {
    question: "J'ai des villes mais pas de maisons. J'ai des montagnes mais pas d'arbres. J'ai de l'eau mais pas de poissons. Qui suis-je ?",
    reponse: "Une carte",
  },
  {
    question: "Je peux être lu, mais tu ne peux pas écrire à mon sujet. Tu me donnes toujours, mais tu ne me gardes que rarement. Qui suis-je ?",
    reponse: "Un livre emprunté",
  },
  {
    question: "Je viens deux fois dans une semaine, une fois dans une année, mais jamais dans une journée. Qui suis-je ?",
    reponse: "La lettre 'E'",
  },
  {
    question: "Je suis difficile à saisir, mais tu me tiendras dans ta main quand tu me trouveras. Qui suis-je ?",
    reponse: "Ton souffle",
  },
  {
    question: "Plus je suis chaud, plus je deviens froid. Qui suis-je ?",
    reponse: "Le café",
  },
  {
    question: "Je suis la matière des rêves. Je couvre les idées brisées. Je transforme les âmes en ailes. Qui suis-je ?",
    reponse: "Un livre",
  },
  {
    question: "Je suis blanc quand je suis sale et noir quand je suis propre. Qui suis-je ?",
    reponse: "Une ardoise",
  },
  {
    question: "Je peux voler sans avoir des ailes. Je peux pleurer sans avoir des yeux. Qui suis-je ?",
    reponse: "Un nuage",
  },
  {
    question: "Je commence la nuit et finis le matin. Qui suis-je ?",
    reponse: "La lettre 'N'",
  },
  {
    question: "Je peux être lu, mais tu ne peux pas écrire à mon sujet. Tu me donnes toujours, mais tu ne me gardes que rarement. Qui suis-je ?",
    reponse: "Un livre emprunté",
  },
  {
    question: "Je me nourris de tout ce qui m'entoure, de l'air, de la terre et même des arbres. Qui suis-je ?",
    reponse: "Un feu",
  },
  {
    question: "Je suis blanc quand je suis sale et noir quand je suis propre. Qui suis-je ?",
    reponse: "Une ardoise",
  },
  {
    question: "Je suis liquide, mais si tu m'enlèves de l'eau, je deviens solide. Qui suis-je ?",
    reponse: "Le thé",
  },
  {
    question: "Je suis le début de la fin et la fin de chaque endroit. Je suis le début de l'éternité, la fin du temps et de l'espace. Qui suis-je ?",
    reponse: "La lettre 'E'",
  },
  {
    question: "Je suis difficile à saisir, mais tu me tiendras dans ta main quand tu me trouveras. Qui suis-je ?",
    reponse: "Ton souffle",
  },
];

zokou({ nomCom: "devinette", categorie: "Jeux", reaction: "🧩" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;

  // Choisir une devinette aléatoire
  const devinette = devinettes[Math.floor(Math.random() * devinettes.length)];
  
  // Envoyer la question de la devinette
  await zk.sendMessage(
    dest,
    {
      text: `Devine: ${devinette.question} \n Tu as 30 secondes pour réfléchir.`,
    },
    { quoted: ms }
  );

  // Attendre 30 secondes avant d'envoyer la réponse
  await delay(30000);

  // Répondre
  await zk.sendMessage(
    dest,
    {
      text: `La réponse était : ${devinette.reponse}.`,
    },
    { quoted: ms }
  );
});

// Fonction pour créer une pause/délai en millisecondes
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
