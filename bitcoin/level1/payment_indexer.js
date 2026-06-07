// level1/payment_indexer.js (ES Module версия)
// Индексатор платежей для Bitcoin Testnet

import https from 'https';

// Конфигурация
const API_URL = 'https://blockstream.info/testnet/api/';
const MY_ADDRESS = 'tb1q6lsa23ure3rp5q47r9zkg5a8h6nkuu04su9gre'; // это адрес моего тестового кошелька Electrum Testnet

// Вспомогательная функция для HTTP-запросов
function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Функция для получения текущей высоты блокчейна
async function getCurrentHeight() {
    const tipHash = await get(API_URL + 'blocks/tip/hash');
    const status = JSON.parse(await get(API_URL + `block/${tipHash}/status`));
    return status.height;
}

// Основная функция проверки платежей
async function checkIncomingPayments(address) {
    console.log(`\n🔍 Проверка входящих платежей для адреса: ${address}\n`);
    console.log('⏳ Загрузка данных...\n');

    try {
        const url = `${API_URL}address/${address}/txs`;
        const response = await get(url);
        const txs = JSON.parse(response);

        if (!txs || txs.length === 0) {
            console.log('❌ Транзакций для этого адреса не найдено.');
            return [];
        }

        const currentHeight = await getCurrentHeight();
        const incomingTxs = [];

        for (const tx of txs) {
            for (const vout of tx.vout) {
                if (vout.scriptpubkey_address === address) {
                    const blockHeight = tx.status?.block_height;
                    const confirmations = blockHeight
                        ? currentHeight - blockHeight + 1
                        : 0;

                    incomingTxs.push({
                        txid: tx.txid,
                        amount: vout.value,
                        confirmations: confirmations,
                        confirmed: !!blockHeight,
                        blockTime: tx.status?.block_time
                    });
                    break;
                }
            }
        }

        if (incomingTxs.length === 0) {
            console.log(`❌ Входящих платежей на адрес ${address} не найдено.`);
            return [];
        }

        console.log(`💰 НАЙДЕНО ВХОДЯЩИХ ПЛАТЕЖЕЙ: ${incomingTxs.length}\n`);
        console.log('=' .repeat(70));

        for (let i = 0; i < incomingTxs.length; i++) {
            const p = incomingTxs[i];
            const date = p.blockTime
                ? new Date(p.blockTime * 1000).toLocaleString('ru-RU')
                : 'В мемпуле (ожидает включения в блок)';

            console.log(`📦 Транзакция #${i + 1}`);
            console.log(`   🔄 Хэш (TXID): ${p.txid}`);
            console.log(`   💰 Сумма: ${p.amount} BTC`);
            console.log(`   ✅ Статус: ${p.confirmed ? 'Подтверждена' : 'Неподтверждена (в мемпуле)'}`);
            console.log(`   📊 Подтверждений: ${p.confirmations}`);
            console.log(`   ⏰ Время: ${date}`);
            console.log('-'.repeat(70));
        }

        return incomingTxs;

    } catch (error) {
        console.error('❌ Ошибка при проверке платежей:', error.message);
        return [];
    }
}

// Запуск
async function main() {
    console.log('=' .repeat(70));
    console.log('🚀 BITCOIN TESTNET - ИНДЕКСАТОР ПЛАТЕЖЕЙ (Уровень 1)');
    console.log('=' .repeat(70));

    if (MY_ADDRESS === 'tb1...') {
        console.log('\n⚠️  ВНИМАНИЕ! Укажите свой testnet-адрес в переменной MY_ADDRESS!');
        return;
    }

    await checkIncomingPayments(MY_ADDRESS);
}

main();