// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StorageArray {
    uint[] private values;

    // Добавить значение в конец массива
    function add(uint value) public {
        values.push(value);
    }

    // Получить значение по индексу
    function get(uint index) public view returns (uint) {
        require(index < values.length, "Index out of bounds");
        return values[index];
    }

    // Узнать длину массива
    function length() public view returns (uint) {
        return values.length;
    }

    // Удалить элемент по индексу
    function remove(uint index) public {
        require(index < values.length, "Index out of bounds");

        // Перемещаем последний элемент на место удаляемого
        values[index] = values[values.length - 1];
        // Удаляем последний элемент
        values.pop();
    }
}