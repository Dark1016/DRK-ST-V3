
const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { ajouterOuMettreAJourJid, mettreAJourAction, verifierEtatJid } = require("../bdd/antilien");
const { atbajouterOuMettreAJourJid, atbverifierEtatJid } = require("../bdd/antibot");
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');
const { generatepp } = require('../framework/mesfonctions');

zokou({ nomCom: "tagall", categorie: 'Group', reaction: "📣" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) { repondre("✋🏿 ✋🏿 Cette commande est réservée aux groupes ❌"); return; }
  if (!arg || arg === ' ') { mess = 'Aucun Message'; } else { mess = arg.join(' '); }
  let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
  var tag = "";
  tag += `========================\n  
        *🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑*
========================\n
👥 Groupe : ${nomGroupe} 🚀 
👤 Auteur : *${nomAuteurMessage}* 👋 
📜 Message : *${mess}* 📝

⬡ Continuez d'utiliser ⬡┃DRK-ST-V3┃⬡
========================\n\n
`;

  let emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$', '😟', '🥵', '🐅'];
  let random = Math.floor(Math.random() * (emoji.length - 1));

  for (const membre of membresGroupe) {
    tag += `${emoji[random]}      @${membre.id.split("@")[0]}\n`;
  }

  if (verifAdmin || superUser) {
    zk.sendMessage(dest, { text: tag, mentions: membresGroupe.map((i) => i.id) }, { quoted: ms });
  } else { repondre('Commande réservée aux administrateurs'); }
});

zokou({ nomCom: "link", categorie: 'Group', reaction: "🙋" }, async (dest, zk, commandeOptions) => {
  const { repondre, nomGroupe, nomAuteurMessage, verifGroupe } = commandeOptions;
  if (!verifGroupe) { repondre("Attends, tu veux le lien dans mes DM ?"); return; };

  var link = await zk.groupInviteCode(dest);
  var lien = `https://chat.whatsapp.com/${link}`;

  let mess = `Bonjour ${nomAuteurMessage}, voici le lien du groupe ${nomGroupe} \n\nLien : ${lien}`;
  repondre(mess);
});

zokou({ nomCom: "promote", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
  if (!verifGroupe) { return repondre("Pour les groupes uniquement"); }

  const verifMember = (user) => {
    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      } else { return true; }
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (const m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);
    }
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';
  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu);
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  zkad = verifGroupe ? a.includes(idBot) : false;

  try {
    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {
              var txt = `🎊🎊🎊  @${auteurMsgRepondu.split("@")[0]} a été nommé administrateur du groupe.\n`;
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });
            } else { return repondre("Ce membre est déjà administrateur du groupe."); }
          } else { return repondre("Ce membre ne fait pas partie du groupe."); }
        } else { return repondre("Désolé, je ne peux pas effectuer cette action car je ne suis pas administrateur du groupe."); }
      } else { repondre("Veuillez mentionner le membre à promouvoir"); }
    } else { return repondre("Désolé, vous ne pouvez pas effectuer cette action car vous n'êtes pas administrateur du groupe."); }
  } catch (e) { repondre("Oups " + e); }
});

zokou({ nomCom: "demote", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
  if (!verifGroupe) { return repondre("Pour les groupes uniquement"); }

  const verifMember = (user) => {
    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      } else { return true; }
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (const m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);
    }
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';
  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu);
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  zkad = verifGroupe ? a.includes(idBot) : false;

  try {
    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {
              repondre("Ce membre n'est pas administrateur du groupe.");
            } else {
              var txt = `@${auteurMsgRepondu.split("@")[0]} a été démis de son poste d'administrateur du groupe.\n`;
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });
            }
          } else { return repondre("Ce membre ne fait pas partie du groupe."); }
        } else { return repondre("Désolé, je ne peux pas effectuer cette action car je ne suis pas administrateur du groupe."); }
      } else { repondre("Veuillez mentionner le membre à démettre"); }
    } else { return repondre("Désolé, vous ne pouvez pas effectuer cette action car vous n'êtes pas administrateur du groupe."); }
  } catch (e) { repondre("Oups " + e); }
});

zokou({ nomCom: "remove", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu

, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
  if (!verifGroupe) { return repondre("Pour les groupes uniquement"); }

  const verifMember = (user) => {
    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      } else { return true; }
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (const m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);
    }
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';
  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu);
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  zkad = verifGroupe ? a.includes(idBot) : false;

  try {
    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            var txt = `@${auteurMsgRepondu.split("@")[0]} a été retiré du groupe.\n`;
            await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
            zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });
          } else { return repondre("Ce membre ne fait pas partie du groupe."); }
        } else { return repondre("Désolé, je ne peux pas effectuer cette action car je ne suis pas administrateur du groupe."); }
      } else { repondre("Veuillez mentionner le membre à retirer"); }
    } else { return repondre("Désolé, vous ne pouvez pas effectuer cette action car vous n'êtes pas administrateur du groupe."); }
  } catch (e) { repondre("Oups " + e); }
});

// Ajout des fonctionnalités de protection contre les liens et les bots

zokou({ nomCom: "antilink", categorie: 'Protection', reaction: "🔗" }, async (dest, zk, commandeOptions) => {
  let { repondre, verifGroupe, superUser, msgRepondu, infosGroupe } = commandeOptions;
  if (!verifGroupe) { return repondre("Pour les groupes uniquement"); }
  
  let etat = await verifierEtatJid(dest);
  if (msgRepondu === 'on') {
    if (etat) { return repondre("La protection contre les liens est déjà activée."); }
    await ajouterOuMettreAJourJid(dest, true);
    repondre("Protection contre les liens activée.");
  } else if (msgRepondu === 'off') {
    if (!etat) { return repondre("La protection contre les liens est déjà désactivée."); }
    await ajouterOuMettreAJourJid(dest, false);
    repondre("Protection contre les liens désactivée.");
  } else {
    repondre("Veuillez spécifier 'on' ou 'off'.");
  }
});

zokou({ nomCom: "antibot", categorie: 'Protection', reaction: "🤖" }, async (dest, zk, commandeOptions) => {
  let { repondre, verifGroupe, superUser, msgRepondu } = commandeOptions;
  if (!verifGroupe) { return repondre("Pour les groupes uniquement"); }
  
  let etat = await atbverifierEtatJid(dest);
  if (msgRepondu === 'on') {
    if (etat) { return repondre("La protection contre les bots est déjà activée."); }
    await atbajouterOuMettreAJourJid(dest, true);
    repondre("Protection contre les bots activée.");
  } else if (msgRepondu === 'off') {
    if (!etat) { return repondre("La protection contre les bots est déjà désactivée."); }
    await atbajouterOuMettreAJourJid(dest, false);
    repondre("Protection contre les bots désactivée.");
  } else {
    repondre("Veuillez spécifier 'on' ou 'off'.");
  }
});
```

