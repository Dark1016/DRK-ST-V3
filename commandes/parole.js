const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
    nomCom: "lyrics",
    reaction: "✨",
    categorie: "Search"
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;

    try {
        if (!arg || arg.length === 0) return repondre("Quel est le nom de la musique ?");

        let result = await axios.get(`http://api.maher-zubair.tech/search/lyrics?q=${arg.join(' ')}`);

        let lyrics = result.data.result;

        if (lyrics.error) return repondre("Aucune paroles trouvées");

        let msg = `---------*DRK_ST_V1*--------

* *Artiste :* ${lyrics.artist}

* *Titre :* ${lyrics.title}

${lyrics.lyrics}`;

        zk.sendMessage(dest, { image: { url: './media/lyrics-img.jpg' }, caption: msg }, { quoted: ms });
    
    } catch (err) {
        console.error('Erreur :', err);
        repondre('Une erreur est survenue lors de la récupération des paroles');
    }
});
