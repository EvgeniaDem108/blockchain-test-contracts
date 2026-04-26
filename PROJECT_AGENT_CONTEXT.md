# Контекст проекта для агента (живой документ)

**Назначение:** единая точка правды о состоянии репозитория. При новых заданиях сначала сверяйся с этим файлом. После любых существенных изменений в коде, зависимостях или структуре — обновляй соответствующие разделы и дату внизу.

**Последнее обновление:** 2026-04-26 (добавлен `StorageArray` + тесты)

---

## 1. Краткое описание

Учебный/демо **blockchain-project** на базе шаблона **Hardhat 3** (Mocha + ethers.js). В репозитории реализован минимальный контракт хранения `uint` и тест к нему; часть файлов и README унаследованы от шаблона и **не совпадают** с фактическим содержимым `contracts/`.

---

## 2. Технологический стек

| Область | Выбор |
|--------|--------|
| Сборка / задачи | Hardhat **3.4.1** (`hardhat.config.js`, ESM `export default`) |
| Solidity | **0.8.28** (в контракте указано `^0.8.0`) |
| Тесты (TS) | Mocha + Chai + **ethers 6.16** (`@nomicfoundation/hardhat-toolbox-mocha-ethers`) |
| Деплой | Hardhat Ignition 3 (`@nomicfoundation/hardhat-ignition`) |
| Язык конфигурации | JS для Hardhat; тесты и модули Ignition — **TypeScript** |
| Модульность Node | `"type": "module"` в `package.json` |
| TS | `typescript` ~5.8, `module`/`moduleResolution`: **node16**, `strict`: true |

Дополнительно в зависимостях: `forge-std` (как npm-зависимость от GitHub) — в текущем дереве **нет** `.t.sol` тестов в `contracts/`.

---

## 3. Структура репозитория (релевантные пути)

```
blockchain-project/
├── contracts/
│   ├── StorageSimple.sol
│   ├── StorageArray.sol       # массив uint + add/get/length/remove
│   └── StorageMapping.sol     # mapping(address => uint) + set/get/deleteValue
├── test/
│   ├── StorageSimple.test.ts
│   ├── StorageArray.test.ts   # Mocha/ethers тесты для StorageArray
│   └── StorageMapping.test.ts # Mocha/ethers тесты для StorageMapping
├── ignition/modules/
│   ├── StorageSimple.ts       # Ignition: деплой StorageSimple
│   └── Counter.ts             # ссылается на Counter — контракта нет в contracts/
├── scripts/
│   └── send-op-tx.ts          # пример tx в сети типа OP (hardhatOp)
├── hardhat.config.js
├── tsconfig.json
├── package.json
├── README.md                  # в основном текст шаблона (Counter, solidity tests)
├── .gitignore
└── .idea/                     # JetBrains WebStorm/IDEA
```

Сгенерированные каталоги (в `.gitignore`): `artifacts/`, `cache/`, `dist/`, `node_modules/`, и т.д.

---

## 4. Контракты

### `StorageSimple.sol`

- Приватное поле `uint value`.
- `setValue(uint newValue)` — запись.
- `getValue()` — `view`, возврат значения.

Лицензия: MIT.

### `StorageArray.sol`

- Приватный массив `uint[] values`.
- `add(uint)` — добавить в конец.
- `get(uint)` — получить по индексу (revert: `Index out of bounds`).
- `length()` — длина массива.
- `remove(uint)` — удаление через swap-with-last + `pop()` (revert: `Index out of bounds`).

### `StorageMapping.sol`

- Приватный `mapping(address => uint) userValues`.
- `set(address,uint)` — записать значение для адреса.
- `get(address)` — прочитать значение (по умолчанию `0` для пустого ключа).
- `deleteValue(address)` — удалить значение (сбросить в `0`).

---

## 5. Тесты

### `test/StorageSimple.test.ts`

- Hardhat 3: `import { network } from "hardhat"`, `const { ethers } = await network.create()`, деплой через `ethers.deployContract("StorageSimple")`.
- Импорт `@nomicfoundation/hardhat-ethers` для подтягивания типов `ethers` на `NetworkConnection`.
- `setValue(42)` → `getValue()` ожидается `42`.

### `test/StorageArray.test.ts`

- Hardhat 3: `network.create()` + `ethers.deployContract("StorageArray")`.
- Проверяет `add/get/length`, `remove`, и revert-сообщения для выхода за границы.

### `test/StorageMapping.test.ts`

- Hardhat 3: `network.create()` + `ethers.deployContract("StorageMapping")`.
- Проверяет `set/get`, дефолтное значение `0` для адреса без записи и `deleteValue()`.

---

## 6. Деплой (Ignition)

| Модуль | Статус |
|--------|--------|
| `ignition/modules/StorageSimple.ts` | Соответствует `StorageSimple.sol`; экспорт `StorageSimpleModule`, возвращает `{ storage }`. |
| `ignition/modules/Counter.ts` | Вызывает `m.contract("Counter")` и `m.call(counter, "incBy", [5n])`. В **`contracts/` нет `Counter.sol`** — деплой этого модуля упадёт на компиляции/резолве артефакта, если не добавить контракт. |

---

## 7. Скрипты

- **`scripts/send-op-tx.ts`:** создаёт сеть `hardhatOp` с `chainType: "op"`, отправляет 1 wei самому себе. Требует корректной конфигурации сети Hardhat 3 для OP (в текущем `hardhat.config.js` **нет** явных `networks` — поведение зависит от дефолтов Hardhat).

---

## 8. Конфигурация

### `hardhat.config.js`

- `import { defineConfig } from "hardhat/config"`, плагин toolbox: `plugins: [hardhatToolboxMochaEthers]` (регистрирует Mocha и подзадачу `test mocha`, без этого — ошибка HHE1200).
- `solidity: "0.8.28"`, таймаут Mocha: `test.mocha.timeout` (20_000 мс).

Нет кастомных `networks`, `paths`, плагинов keystore и т.д. (в отличие от примеров в README).

### `package.json`

- `npm test` запускает `hardhat test`.
- Доп. скрипты: `test:mocha`, `test:solidity`, `compile`.

---

## 9. README vs реальность

README обновлён под фактический проект: `StorageSimple`, команды запуска тестов и локального деплоя через Ignition.

---

## 10. Риски и заметки для задач

1. **Counter Ignition без контракта** — либо удалить/заменить модуль, либо добавить `Counter.sol`.
2. **npm script `test`** — интегрирован с Hardhat (`npm test`).
3. **OP-скрипт** — проверять наличие сети `hardhatOp` в конфиге при доработках.
4. Кодировка/переносы строк в `StorageSimple.sol` — CRLF (Windows); при линтерах учитывать единообразие.

---

## 11. Типичные команды

```bash
npx hardhat compile
npx hardhat test
npx hardhat test mocha
npx hardhat ignition deploy ignition/modules/StorageSimple.ts
```

(Сеть для ignition указывается флагом `--network`, если настроены сети.)

---

## Журнал изменений (кратко)

| Дата | Изменение |
|------|-----------|
| 2026-04-26 | Первичный снимок: зафиксированы StorageSimple, тест, два модуля Ignition, расхождения README/Counter, заглушка `npm test`. |
| 2026-04-26 | Откат: удалён временно добавленный `contracts/Counter.sol`; снова только `StorageSimple.sol` в `contracts/`. |
| 2026-04-26 | `hardhat.config.js`: `defineConfig` + `plugins` для toolbox; таймаут в `test.mocha`. `StorageSimple.test.ts`: API Hardhat 3 (`network.create`, `deployContract`). |
| 2026-04-26 | `package.json`: `npm test` → `hardhat test`, добавлены `test:mocha`/`test:solidity`/`compile`. `README.md`: инструкции под `StorageSimple` (тесты/локальный деплой). |
| 2026-04-26 | `README.md`: подставлен адрес деплоя `StorageSimple` (localhost) в пример команд Hardhat console. |
| 2026-04-26 | Откат: `README.md` — адрес деплоя убран, снова используется плейсхолдер для адреса контракта. |
| 2026-04-26 | `README.md`: добавлен раздел «Рефлексия» (трудности/новое/бонус). |
| 2026-04-26 | Добавлены `contracts/StorageArray.sol` и `test/StorageArray.test.ts`; тест мигрирован на Hardhat 3 (`network.create`, без `import { ethers } from "hardhat"`). |
| 2026-04-26 | Добавлен `contracts/StorageMapping.sol` и `test/StorageMapping.test.ts`; `npm test` проходит (8 Mocha-тестов). |
| 2026-04-26 | `.gitignore`: добавлены правила для `ignition/deployments`, `.idea`, `.vscode`, логов и файлов ОС. |

*Добавляйте строки сюда при каждом значимом обновлении проекта агентом или вручную.*
