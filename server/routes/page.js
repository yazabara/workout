define(['app'], function (app) {
	function renderIndex(req, res){
		res.render('layouts/layout');
	}
	function renderPartials (req, res) {
		var name = req.params.name;
		res.render(name);
	}
	return {
		renderIndex: renderIndex,
		renderPartials: renderPartials
	};
});