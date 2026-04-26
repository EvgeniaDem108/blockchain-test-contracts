# blockchain-project — Hardhat 3 + Solidity

Учебный проект для домашнего задания: контракт `StorageSimple` (Solidity), автотесты на TypeScript (Mocha + ethers) и деплой через Hardhat Ignition.

## Содержимое

- **Контракт**: `contracts/StorageSimple.sol`
- **Тесты (Mocha/TS)**: `test/StorageSimple.test.ts`
- **Ignition-модуль**: `ignition/modules/StorageSimple.ts`

## Установка

```shell
npm install
```

## Компиляция

```shell
npm run compile
```

## Тесты

```shell
npm test
```

## Деплой в локальную сеть (Hardhat node + Ignition)

1) Поднять локальную сеть в отдельном терминале (не закрывайте этот терминал):

```shell
npx hardhat node
```

2) Задеплоить контракт через Ignition в `localhost` (в другом терминале):

```shell
npx hardhat ignition deploy ignition/modules/StorageSimple.ts --network localhost
```

3) Проверить чтение/запись (Hardhat console, в третьем терминале).

Запустить консоль:

```shell
npx hardhat console --network localhost
```

Дальше команды выполняются **внутри консоли** (строка `>`), по очереди:

Для проверки контракта contracts/StorageSimple.sol:
```js
const { network } = await import("hardhat");
const { ethers } = await network.connect();

const storage = await ethers.getContractAt(
  "StorageSimple",
  "<ВСТАВЬТЕ_АДРЕС_КОНТРАКТА_ИЗ_ВЫВОДА_IGNITION>"
);

await storage.getValue();      // ожидаемо 0n (до записи)
await storage.setValue(123);   // отправка транзакции
await storage.getValue();      // ожидаемо 123n
```

Для проверки контракта contracts/StorageArray.sol:



## Рефлексия

### Какие трудности возникли при выполнении задания?
Основная сложность была с запуском автотестов в Hardhat 3: из‑за отличий от Hardhat 2 и особенностей подключения тест-раннера Mocha.

### Что нового вы узнали о работе со смарт-контрактами?
На практике разобралась, как подключать контракт и проверять корректность его работы в терминале


## Troubleshooting
ctrl+C  - остановить все процессы Hardhat во всех терминалах
npx hardhat clean
npm run compile
npx hardhat node - Поднимаем локальную сеть (терминал 1)
npx hardhat console --network localhost  - открываем консоль

Выполняем по-очереди внутри консоли:
const { network } = await import("hardhat");
const { ethers } = await network.connect();

const storageArray = await ethers.deployContract("StorageArray"); - или любой нужный мне контракт
await storageArray.add(10)  - или любой другой метод выбранного выше контракта


## 📊 Анализ паттернов хранения

В проекте реализованы три разных подхода к хранению данных в блокчейне:

### 1. StorageSimple (простая переменная)
- Хранит **одно число**
- Самая низкая стоимость газа
- Использование: счетчики, админ-адрес, флаги

### 2. StorageArray (динамический массив)
- Хранит **список чисел**
- Сохраняет порядок элементов
- Поиск значения — медленный (O(n))
- Использование: очереди, история действий, списки

### 3. StorageMapping (отображение)
- Хранит пары **ключ → значение**
- Мгновенный доступ по ключу (O(1))
- Нельзя перебрать все ключи
- Использование: балансы, whitelist, настройки по адресу