// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StorageMapping {
    // Отображение: адрес -> число
    mapping(address => uint) private userValues;

    // Записать значение для указанного адреса
    function set(address user, uint value) public {
        userValues[user] = value;
    }

    // Прочитать значение для указанного адреса
    function get(address user) public view returns (uint) {
        return userValues[user];
    }

    // Удалить значение для указанного адреса (сбросить в 0)
    function deleteValue(address user) public {
        delete userValues[user];
    }
}