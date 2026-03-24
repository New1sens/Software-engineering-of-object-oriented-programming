const fs = require('fs')

const input = fs.readFileSync('sem_02_labrab_01.csv', 'utf8').trim()
.split('\n')

input.forEach((line, i) => {
    const numbs = line.split(' ').map(Number)

    const set = new Set(numbs)
    const sorted = [...numbs].toSorted((a, b) => a - b)

    const odd = numbs.every(n => n % 2 === 1)
    const uniq = set.size === numbs.length
    const inc = numbs.join() === sorted.join()

    if (odd && uniq && inc) {
        console.log(i + 1)
    }
})