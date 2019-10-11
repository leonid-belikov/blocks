// Структура данных:
// data = {
//      id: {
//          color: 'red'/'green'/null
//          text: 'some text',
//          selected: true/false,
//      },..
// }

function Model() {
    this.data = {};
    this.statistics = {
        total: 0,
        selected: 0,
        selected_red: 0,
        selected_green: 0
    }
}

// Получить данные из модели
Model.prototype.getData = function () {
    return {
        data: this.data,
        statistics: this.statistics
    };
};

// Создать новый блок (свойства определить случайным образом) и добавить в data
Model.prototype.createBlock = function () {
    var blockColor = Math.random() < 0.33 ? 'red' : Math.random() < 0.67 ? 'green' : null;
    var blockText = text[Math.floor(Math.random()*32)];
    var id = new Date().getTime();
    var updateEvent = new Event('updateView');
    this.data[id] = {
        color: blockColor,
        text: blockText,
        selected: false
    };
    this.statistics.total++;
    document.dispatchEvent(updateEvent);
};

// Изменить у элемента с переданным id свойство selected
Model.prototype.changeBlockSelection = function (id) {
    var item = this.data[id];
    if (item) {
        var updateEvent = new Event('updateView');
        if (item.selected) {
            this.statistics.selected--;
            if (item.color === 'red') {
                this.statistics.selected_red--;
            }
            if (item.color === 'green') {
                this.statistics.selected_green--;
            }
        } else {
            this.statistics.selected++;
            if (item.color === 'red') {
                this.statistics.selected_red++;
            }
            if (item.color === 'green') {
                this.statistics.selected_green++;
            }
        }
        item.selected = !item.selected;
        document.dispatchEvent(updateEvent);
    }
};

// Изменить у элемента с переданным id свойство color
Model.prototype.changeBlockColor = function (id) {
    var updateEvent = new Event('updateView');
    var item = this.data[id];
    if (item.color === 'red') {
        item.color = 'green';
        if (item.selected) {
            this.statistics.selected_red--;
            this.statistics.selected_green++;
        }
    } else if (item.color === 'green') {
        item.color = 'red';
        if (item.selected) {
            this.statistics.selected_red++;
            this.statistics.selected_green--;
        }
    }
    document.dispatchEvent(updateEvent);
};

// Удалить блок по id
Model.prototype.deleteBlock = function (id) {
    var updateEvent = new Event('updateView');
    var item = this.data[id];
    if (item.selected) {
        this.statistics.selected--;
        if (item.color === 'red') {
            this.statistics.selected_red--;
        }
        if (item.color === 'green') {
            this.statistics.selected_green--;
        }
    }
    delete this.data[id];
    this.statistics.total--;
    document.dispatchEvent(updateEvent);
};