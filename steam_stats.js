const fs = require('fs');
const path = require('path');

async function aktualizujDane() {
    const gry = [
        { id: 730, klucz: "cs2" },
        { id: 271590, klucz: "gta5" },
        { id: 218620, klucz: "payday2" },
        { id: 4000, klucz: "gmod" },
        { id: 2252520, klucz: "fm" }
    ];

    const wyniki = {};

    for (const gra of gry) {
        try {
            const response = await fetch(`https://steamspy.com/api.php?request=app&appid=${gra.id}`);
            const data = await response.json();
            wyniki[gra.klucz] = data.players ? data.players.toLocaleString() + " graczy" : "Brak danych";
        } catch (error) {
            console.error(`Błąd dla gry ${gra.klucz}:`, error);
            wyniki[gra.klucz] = "Błąd pobierania";
        }
    }

    const sciezkaPliku = path.join('Footer_interactive_files', 'Footer_interactive_dane.json');
    fs.writeFileSync(sciezkaPliku, JSON.stringify(wyniki, null, 4), 'utf8');
    console.log("Plik z danymi został zaktualizowany w folderze!");
}

aktualizujDane();