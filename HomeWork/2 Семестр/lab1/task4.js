const fs = require("fs");

const text = fs.readFileSync("parsing_pogoda.html", "utf8");

function getDate(str) {
    const re = /(\d{2}\s+(марта))[\s\S]*?(Пн|Вт|Ср|Чт|Пт|Сб|Вс)/g;

    const arr = [];
    const used = new Set();
    let m;

    while ((m = re.exec(str)) !== null) {
        if (!used.has(m[1])) {
            arr.push({
                date: m[1],
                day: m[3]
            });
            used.add(m[1]);
        }
    }

    return arr.slice(0, 7);
}

function getSunTime(str) {
    const re = /Восход[\s\S]*?(\d{2}:\d{2})[\s\S]*?Закат[\s\S]*?(\d{2}:\d{2})/g;

    const arr = [];
    let m;

    while ((m = re.exec(str)) !== null) {
        arr.push({
            rise: m[1],
            set: m[2]
        });
    }

    return arr.slice(0, 7);
}

const dates = getDate(text);
const sun = getSunTime(text);

for (let i = 0; i < dates.length && i < sun.length; i++) {
    console.log(
        dates[i].date + "  " +
        dates[i].day + "  " +
        "Восход: " + sun[i].rise + "  " +
        "Закат: " + sun[i].set
    );
}