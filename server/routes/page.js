/**
 * Показываем основной layout - и его части, если они есть.
 */
define(['app'], function (app) {

    var mainView = "main";

	function renderIndex(req, res){
		res.render(mainView);
	}
	function renderPartials (req, res) {
		res.render(req.params.name);
	}

    function error404handler (req, res, next){
        res.status(404);
        console.log('Not found URL: %s',req.url);
        res.render(mainView);
    }

    function errorHandler (req, res, next){
        res.status(err.status || 500);
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        res.render(mainView);
    }

	return {
		renderIndex: renderIndex,
        error404handler: error404handler,
        errorHandler : errorHandler,
		renderPartials: renderPartials
	};
});