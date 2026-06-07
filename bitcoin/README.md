# Bitcoin Testnet API Client

> Домашнее задание по блокчейну — работа с Bitcoin Testnet через публичный API

## Уровень выполнения

| Уровень | Статус | Описание |
|---------|--------|----------|
| Level 1 | ✅ Выполнен | Работа с публичным API Blockstream Esplora |
| Level 2 | ⚙️ Частично | Настройка ноды Bitcoin Core |

## Требования

- Node.js v18+
- Доступ в интернет

## Структура проекта

```
bitcoin/
├── config/
│   └── bitcoin.conf        # Конфигурация ноды Bitcoin Core
├── level1/
│   ├── latest_block.js     # Информация о последнем блоке
│   └── payment_indexer.js  # Индексатор входящих платежей
├── README.md
└── REPORT.md
```

### 1. Информация о хэше последнего блока в публичном API-провайдере Blockstream Esplora
Выполнить HTTP-запрос на получение информации о последнем блоке: https://blockstream.info/testnet/api/blocks/tip/hash

### Скрипты

### 1. Информация о последнем блоке

Получает хэш, высоту, время, количество транзакций и размер последнего блока Testnet, а также список первых 10 TXID.

```bash
## Выполнить скрипт из корня проекта
node bitcoin/level1/latest_block.js
```

### 2. Получение тестовых монет

Перейти на https://coinfaucet.eu/en/btc-testnet/ и вставить адрес своего Testnet-кошелька:

```
https://coinfaucet.eu/en/btc-testnet/
```

### 4. Индексатор платежей

Проверяет все входящие транзакции на указанный Testnet-адрес и выводит сумму, статус подтверждения и время каждого платежа.

```bash
## в скрипте bitcoin/level1/payment_indexer.js в переменной const MY_ADDRESS указать мой тестовый адрес кошелька
## Выполнить скрипт из корня проекта
node bitcoin/level1/payment_indexer.js
```

## API

Используется публичный API [Blockstream Esplora](https://github.com/Blockstream/esplora/blob/master/API.md):

```
https://blockstream.info/testnet/api/
```
