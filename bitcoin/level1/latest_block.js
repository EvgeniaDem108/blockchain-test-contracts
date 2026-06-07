// level1/latest_block.js
// Скрипт для получения информации о последнем блоке Bitcoin Testnet
// Уровень 1: работа с публичным API

const API_URL = 'https://blockstream.info/testnet/api/';

async function getLatestBlock() {
    console.log('=== Bitcoin Testnet - Информация о последнем блоке ===\n');

    try {
        // 1. Получаем хэш последнего блока (пункт a)
        const tipHashResponse = await fetch(API_URL + 'blocks/tip/hash');
        const tipHash = await tipHashResponse.text();
        console.log(`✅ Хэш последнего блока: ${tipHash}`);

        // 2. Получаем статус блока, чтобы узнать его высоту (пункт a)
        const statusResponse = await fetch(API_URL + `block/${tipHash}/status`);
        const status = await statusResponse.json();
        const height = status.height;
        console.log(`✅ Высота блока: ${height}`);

        // 3. Получаем полные данные блока (пункт b: время, кол-во транзакций, размер)
        const blockResponse = await fetch(API_URL + `block/${tipHash}`);
        const blockData = await blockResponse.json();

        // Преобразуем время из Unix timestamp в читаемый формат
        const blockDate = new Date(blockData.timestamp * 1000);
        const formattedTime = blockDate.toLocaleString('ru-RU');

        console.log(`✅ Время создания блока: ${formattedTime}`);
        console.log(`✅ Количество транзакций в блоке: ${blockData.tx_count}`);
        console.log(`✅ Размер блока: ${blockData.size} байт (${(blockData.size / 1024).toFixed(2)} КБ)`);

        // 4. Получаем список транзакций (пункт c)
        const txidsResponse = await fetch(API_URL + `block/${tipHash}/txids`);
        const txids = await txidsResponse.json();

        console.log(`\n📋 Список первых 10 транзакций (TXID) из ${txids.length}:`);
        for (let i = 0; i < Math.min(txids.length, 10); i++) {
            console.log(`   ${i+1}. ${txids[i]}`);
        }

        console.log(`\n✨ Готово! Блок ${height} успешно обработан.`);

    } catch (error) {
        console.error('❌ Произошла ошибка:', error.message);
        console.error('   Проверьте подключение к интернету.');
    }
}

// Запускаем функцию
getLatestBlock();