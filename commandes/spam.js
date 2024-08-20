// Définition de la commande 'spam' dans la catégorie 'Test-cmds'
zokou(
  {
    nomCom: 'spam',
    categorie: 'Test-cmds'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, superUser } = commandeOptions;

    // Conversion du premier argument en nombre entier
    const nombre = parseInt(arg[0]);

    // Vérification si le nombre est supérieur à 100
    if (nombre > 100) {
      repondre("Désolé, je ne peux pas envoyer plus de 100 messages à la fois.");
      return;
    }

    // Création du texte à envoyer (les arguments après le premier)
    const texte = arg.slice(1).join(' ');

    // Envoi du message le nombre de fois spécifié, avec un délai d'une seconde entre chaque envoi
    for (let i = 0; i < nombre; i++) {
      repondre(texte);
      await new Promise(resolve => setTimeout(resolve, 1000)); // attendre 1 seconde
    }
  }
);
