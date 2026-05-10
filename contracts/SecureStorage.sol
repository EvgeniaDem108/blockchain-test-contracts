// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SecureStorage {
    address private owner;
    uint private value;
    bytes32 private hashedValue;

    // msg.sender - // тот, кто разворачивает контракт = владелец (мой адрес присваивается в момент создания контракта)
    constructor() {
        owner = msg.sender;
    }

    // Модификатор - проверка, что вызывающий - владелец: require(условие, "сообщение об ошибке");
    //  _  - это placeholder, если проверка прошла успешно, сюда подставляется тело метода setValue (value = newValue;)
    // msg.sender - тот, кто вызывает функцию
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner! You cannot call this function");
        _;
    }

    // onlyOwner - только владелец может изменять значение. Т.е. сначала вызывается modifier onlyOwner()
    function setValue(uint newValue) public onlyOwner {
        value = newValue;
    }

    // onlyOwner - только владелец может изменять значение. Т.е. сначала вызывается modifier onlyOwner()
    function setHashedValue(bytes32 hash) public onlyOwner {
        hashedValue = hash;
    }

    // Метод, показывающий владельца
    function getOwner() public view returns (address) {
        return owner;
    }

    function getValue() public view returns (uint) {
        return value;
    }

    function getHashedValue() public view returns (bytes32) {
        return hashedValue;
    }

    // r, s - Эллиптическая криптография, используемая Ethereum, создаёт подпись, которая состоит из двух чисел: r и s.
    // v - recovery id, нужен, потому что из r и s можно восстановить два возможных публичных ключа. v говорит, какой из них правильный.
    function verifyMessage(
        string memory message,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public view returns (bool) {
        // Считаем хэш сообщения
        bytes32 messageHash = keccak256(abi.encodePacked(message));

        // Шаг 1: берем messageHash, конкатинируем с префиксом: "\x19Ethereum Signed Message:\n32" + messageHash...
        // Шаг 2: считаем хэш от Шага 1 = ETHERSIGNED HASH
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        //  Восстанавливаем адрес подписанта из подписи
        // ecrecover — это встроенная функция Ethereum, которая математически восстанавливает адрес из подписи, без необходимости знать приватный ключ.
        address signer = ecrecover(ethSignedHash, v, r, s);

        // Проверяем, что подписант - владелец
        return signer == owner;
    }
}