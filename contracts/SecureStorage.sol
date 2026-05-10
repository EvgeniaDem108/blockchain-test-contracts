// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract StorageSimple {
    address private owner;
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

// Удалить после отладки
   // function setValue(uint newValue) public {
   //     value = newValue;
   // }

    // Чтение значения доступно всем
    function getValue() public view returns (uint) {
        return value;
    }

    // Метод, показывающий владельца
    function getOwner() public view returns (address) {
        return owner;
    }

    function getHashedValue() public view returns (bytes32) {
        return hashedValue;
    }
}