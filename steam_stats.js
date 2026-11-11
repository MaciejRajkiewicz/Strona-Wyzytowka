const fs = require('fs');
const path = require('path');

async function aktualizujDane() {
    const gry = [
        { id: 730, klucz: "cs2" },
        { id: 271590, klucz: "gta5" },
        { id: 218620, klucz: "payday2" },
        { id: 4000, klucz: "gmod" },
        { id: 2252570, klucz: "fm" }   // ← poprawiony AppID FM 2024
    ];

    const wyniki = {};

    for (const gra of gry) {
        try {
            // Oficjalne API Steam – aktualna liczba graczy online
            const response = await fetch(
                `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${gra.id}`
            );
            const data = await response.json();

            const liczba = data?.response?.player_count;

            wyniki[gra.klucz] = (typeof liczba === "number") ? liczba : 0;
        } catch (error) {
            console.error(`Błąd dla gry ${gra.klucz}:`, error);
            wyniki[gra.klucz] = 0;
        }

        // Małe opóźnienie, żeby nie spamować API
        await new Promise(r => setTimeout(r, 300));
    }

    const sciezkaPliku = path.join('Footer_interactive_files', 'Footer_interactive_dane.json');
    fs.writeFileSync(sciezkaPliku, JSON.stringify(wyniki, null, 4), 'utf8');
    console.log("Plik z danymi został zaktualizowany:", wyniki);
}

aktualizujDane();