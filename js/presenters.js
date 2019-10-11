function Presenter() {
    var view;

    function init() {
        var model = new Model();
        view = new View(model.getData().statistics);

        view.addCreateBlockHandler(function () {
            model.createBlock();
        });

        view.addDeleteBlockHandler(function (id) {
            model.deleteBlock(id);
        });

        view.addBlockClickHandler( function (id) {
            model.changeBlockSelection(id);
        }, function (id) {
            model.changeBlockColor(id);
        });

        view.addConfirmHandler( function (id) {
            model.deleteBlock(id);
        });

        document.addEventListener('updateView', function () {
            var data = model.getData();
            view.updateBlocks(data.data);
            view.updateStatistics(data.statistics);
        })
    }

    init();

    return {

        getView: function () {
            return view;
        }

    }
}