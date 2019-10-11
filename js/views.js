function View(statistics) {
    var html;

    // Сгенерировать верстку
    function init(statistics) {
        html = $('<div>' +
                '<header>' +
                    '<div class="container">' +
                        '<div class="panel">' +
                            '<div class="panel__toolbar">' +
                                '<button class="panel__create-btn" id="create-btn">Добавить блок</button>' +
                            '</div>' +
                            '<div class="panel__statusbar">' +
                                '<div class="panel__row">' +
                                    '<div class="panel__title">Всего блоков:</div>' +
                                    '<div class="panel__indicator" id="total-count">' + statistics.total + '</div>' +
                                '</div>' +
                                '<div class="panel__row">' +
                                    '<div class="panel__title">Выделено блоков:</div>' +
                                    '<div class="panel__indicator" id="selected-count">' + statistics.selected + '</div>' +
                                '</div>' +
                                '<div class="panel__row">' +
                                    '<div class="panel__title">Зеленых блоков (из числа выделенных):</div>' +
                                    '<div class="panel__indicator" id="selected-green-count">' + statistics.selected_green + '</div>' +
                                '</div>' +
                                '<div class="panel__row">' +
                                    '<div class="panel__title">Красных блоков (из числа выделенных):</div>' +
                                    '<div class="panel__indicator" id="selected-red-count">' + statistics.selected_red + '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</header>' +
                '<div class="container" id="blocks">' +
                '</div>' +
                '<div class="confirm__wrap">' +
                    '<div class="confirm">' +
                        '<div class="confirm__text">Подтвердите удаление блока</div>' +
                        '<div class="confirm__button-area">' +
                            '<div class="confirm__btn" id="delete-btn">Удалить</div>' +
                            '<div class="confirm__btn" id="cancel-btn">Отмена</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        html.on('click', '#cancel-btn', function () {
            html.find('.confirm__wrap').removeClass('confirm__wrap_shown');
        })
    }

    // Обновить статистику
    function updateStatistics(statistics) {
        html.find("#total-count").text(statistics.total);
        html.find("#selected-count").text(statistics.selected);
        html.find("#selected-green-count").text(statistics.selected_green);
        html.find("#selected-red-count").text(statistics.selected_red);
    }

    // Обновить список блоков
    function updateBlocks(data) {
        var blocks = '';
        $.each(data, function (id, item) {
            blocks += getBlockHtml(id, item);
        });
        html.find("#blocks").html($(blocks));
    }

    function getBlockHtml(id, item) {
        var classColor = item.color === 'red' ? ' block_red' : item.color === 'green' ? ' block_green' : '';
        var classSelected = item.selected ? ' block_selected' : '';
        return '<div class="block' + classColor + classSelected + '" id="' + id + '">' +
                '<div class="block__text">' +
                    item.text +
                '</div>' +
                '<img src="./img/close_icon.png" class="block__btn">' +
            '</div>'
    }



    init(statistics);

    // Публичные методы:
    return {

        // Вернуть верстку
        getHtml: function () {
            return html;
        },

        // Обновить верстку
        updateBlocks: updateBlocks,

        // Обновить статистику
        updateStatistics: updateStatistics,

        // Повесить обработчик на клик по кнопке Добавить
        addCreateBlockHandler: function (handler) {
            html.on('click', '#create-btn', handler);
        },

        // Повесить обработчик на клик по крестику
        addDeleteBlockHandler: function (handler) {
            html.on('click', '.block__btn', function (e) {
                var blockElem = $(this.parentElement);
                var id = blockElem.attr('id');
                e.stopPropagation();
                if (blockElem.hasClass('block_red') ||
                    blockElem.hasClass('block_green')) {
                    html.find('.confirm__wrap').addClass('confirm__wrap_shown').attr('block-id', id);
                } else {
                    handler(id);
                }
            });
        },
    
        // Повесить обработчик на клик/даблклик по блоку
        addBlockClickHandler: function (handlerOne, handlerDbl) {
            html.on('click', '.block', function () {
                var elem = $(this);
                if (elem.attr('timer-id')) {
                    clearTimeout(Number($(this).attr('timer-id')));
                    elem.removeAttr('timer-id');
                    elem.toggleClass('block_red');
                    elem.toggleClass('block_green');
                    handlerDbl($(this).attr('id'));
                } else {
                    elem.attr('timer-id',
                        String(
                            setTimeout(function () {
                                elem.removeAttr('timer-id');
                                elem.toggleClass('block_selected');
                                handlerOne(elem.attr('id'));
                            }, 200)
                        )
                    )
                }
            });
        },

        // Повесить обработчик на клик на подтверждение удаления
        addConfirmHandler: function (handler) {
            html.on('click', '#delete-btn', function () {
                var confirmElem = html.find('.confirm__wrap');
                var id = confirmElem.attr('block-id');
                handler(id);
                confirmElem.removeClass('confirm__wrap_shown');
            });
        }
    }
}