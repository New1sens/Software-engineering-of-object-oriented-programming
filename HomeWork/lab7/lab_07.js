const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.championat.com/hockey/_nhl.html';

async function parseHockey() {
  try {
    const response = await axios.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const allTeams = [];

    let csv = 'position,team,games,wins,points\n';

    $('.table tbody tr').each((i, el) => {
      const position = $(el).find('td:nth-child(1)').text().trim();
      const team = $(el).find('td:nth-child(2)').text().trim();
      const games = $(el).find('td:nth-child(3)').text().trim();
      const wins = $(el).find('td:nth-child(4)').text().trim();
      const points = $(el).find('td:nth-child(10)').text().trim();

      if (!team || team === 'Команда') return; // Пропускаем заголовок

      csv += `${position},${team},${games},${wins},${points}\n`;

      allTeams.push({
        position: parseInt(position) || 0,
        team,
        games: parseInt(games) || 0,
        wins: parseInt(wins) || 0,
        points: parseInt(points) || 0
      });
    });

    fs.writeFileSync('hockey.csv', csv, 'utf8');
    fs.writeFileSync('hockey.json', JSON.stringify(allTeams, null, 2), 'utf8');

    console.log('Собрано команд!:', allTeams.length);
  } catch (err) {
    console.log('Ошибка:', err.message);
  }
}

parseHockey();