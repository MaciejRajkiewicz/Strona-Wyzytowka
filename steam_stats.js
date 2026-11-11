const fs = require('fs');
const path = require('path');

const gry = [
    { id: 730, klucz: "cs2" },        // Counter-Strike 2
    { id: 271590, klucz: "gta5" },    // GTA V
    { id: 218620, klucz: "payday2" }, // PAYDAY 2
    { id: 4000, klucz: "gmod" },      // Garry's Mod
    { id: 4530370, klucz: "fm" }      // Football Manager
];

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function pobierzCCU(appid) {
    const url = `https://steamspy.com/api.php?request=appdetails&appid=${appid}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    // ccu = peak concurrent users (wczoraj)
    if (typeof data.ccu === 'number') {
        return data.ccu;
    }
    throw new Error('Brak pola ccu w odpowiedzi');
}

async function aktualizujDane() {
    const wyniki = {};
    const sciezkaPliku = path.join('Footer_interactive_files', 'Footer_interactive_dane.json');

    // Wczytaj poprzednie dane (fallback przy błędzie)
    let poprzednie = {};
    try {
        if (fs.existsSync(sciezkaPliku)) {
            poprzednie = JSON.parse(fs.readFileSync(sciezkaPliku, 'utf8'));
        }
    } catch (e) {
        console.warn('Nie udało się wczytać poprzednich danych:', e.message);
    }

    for (const gra of gry) {
        try {
            const ccu = await pobierzCCU(gra.id);
            wyniki[gra.klucz] = ccu;
            console.log(`${gra.klucz}: ${ccu}`);
        } catch (error) {
            console.error(`Błąd dla ${gra.klucz}:`, error.message);
            // Zachowaj starą wartość albo ustaw 0
            wyniki[gra.klucz] = poprzednie[gra.klucz] ?? 0;
        }
        // Limit SteamSpy: max 1 request / sekundę
        await sleep(1100);
    }

    fs.writeFileSync(sciezkaPliku, JSON.stringify(wyniki, null, 2), 'utf8');
    console.log('Plik z danymi został zaktualizowany.');
}

aktualizujDane().catch(err => {
    console.error('Krytyczny błąd skryptu:', err);
    process.exit(1);
});