    let json = `
        { 
            "a": 1, 
            "b":   { "c": 2, "d": 3 }, 
            "e": 4, 
            "fff":{ "v": 10 } 
        };`;

const re = /"([A-Za-z0-9_])"\s*:\s*({[^{}]*})/g;

const value = [...json.matchAll(re)].map(m => m[2]);

console.log(value);
// [ '{ "c": 2, "d": 3 }', '{ "v": 10 }' ]