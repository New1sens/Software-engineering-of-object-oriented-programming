import axios from "axios";
import fs from "fs/promises";

const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 YaBrowser/25.12.0.0 Safari/537.36",
    accept: "*/*",
    "Referer": "https://www.wildberries.ru/",
};

async function getProducts(page) {
    //Нужно смотреть на ссылки на WB и если версия отличается, то в ссылке вручную указать версию (V18)
    const baseUrl = 'https://search.wb.ru/exactmatch/ru/common/v18/search?query=микрофоны&sort=price_desc&page=${page}&resultset=catalog&appType=1&curr=rub&dest=-1257786';
    const query = 'микрофоны';
    const sort = 'pricedown';
    const dest = '123585853';
    const spp = '30';

    const url = `${baseUrl}?ab_testing=false&ab_vector_search=e5_new&appType=1&curr=rub&dest=${dest}&hide_dtype=9&hide_vflags=4294967296&inheritFilters=false&lang=ru&page=${page}&query=${encodeURIComponent(query)}&resultset=catalog&sort=${sort}&spp=${spp}&suppressSpellcheck=false`;

    try {
        const res = await axios.get(url, { headers, timeout: 10000 });
        const data = res.data;
        if (page === 1) {
            console.log("Всего найдено товаров:", data.metadata?.total || "неизвестно");
        }
        return data.products || [];
    } catch (err) {
        console.log("Ошибка при загрузке страницы", page, ":", err.message);
        return [];
    }
}

async function main() {
    const pages = 3;
    let all = [];

    for (let i = 1; i <= pages; i++) {
        console.log("Загружается страница", i);
        const products = await getProducts(i);
        console.log("Товаров на странице:", products.length);
        all = all.concat(products);
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log("Всего собрано товаров:", all.length);

    const result = all.map(p => ({
        brand: p.brand || 'Unknown',
        name: p.name || 'Unknown',
        feedbacks: p.reviewRating || 0,
        supplierRating: p.supplierRating || 0,
        link: `https://www.wildberries.ru/catalog/${p.id}/detail.aspx`,
        price: (p.priceU || 0) / 100,
        basePrice: (p.priceU || 0) / 100,
        characteristics: {
            color: p.colors?.[0]?.name || "нет данных",
            category: p.subjectName || "нет данных",
            quantity: p.totalQuantity || "нет данных",
            volume: p.volume || "нет данных"
        }
    }));

    const micro = result.filter(p => p.name.toLowerCase().includes("микрофон") || p.characteristics.category.toLowerCase().includes("микрофон"));

    micro.sort((a, b) => b.price - a.price);

    console.log("После фильтрации микрофонов:", micro.length);

    const top10 = micro.slice(0, 10);
    console.log("лучшие микрофоны (по цене):");
    top10.forEach((p, i) => console.log(`${i+1}. ${p.brand} ${p.name} - ${p.price} руб.`));

    try {
        await fs.writeFile("micro.json", JSON.stringify(micro, null, 2));
        console.log("Файл micro.json сохранён");
    } catch (e) {
        console.log("Ошибка при записи файла:", e.message);
    }
}

main();
