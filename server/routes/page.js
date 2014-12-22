/**
 * Показываем основной layout - и его части, если они есть.
 */
define(['app'], function (app) {
	function renderIndex(req, res){
		res.render('layouts/layout');
	}
	function renderPartials (req, res) {
		res.render(req.params.name);
	}
	return {
		renderIndex: renderIndex,
		renderPartials: renderPartials
	};
});