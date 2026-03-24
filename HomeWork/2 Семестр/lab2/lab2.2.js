const fs = require('fs')
const input = fs.readFileSync('sem_02_labrab_01.csv', 'utf8').trim().split('\n')
    

    input.forEach((line, i) => {
        const numbs = line.split(' ').map(Number)

        const dict = {} 
        numbs.forEach(n => dict[n] = (dict[n] || 0) + 1)

        let triple
        const singles = []

        for (let k in dict) {
            if (dict[k] === 3) triple = Number(k)
            if (dict[k] === 1) singles.push(Number(k))
        }

        
        if (triple && singles.length === 3) {
            const avg = singles.reduce((a, b) => a + b) / singles.length
            if (triple > avg) {
                console.log(i + 1, line)
          }
      }
})