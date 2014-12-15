define(['routes/page'], function (page) {
	return function (app) {
		app.get('/', page.renderIndex);
		app.get('/:name', page.renderPartials);
		//app.get('/workout/:name', page.renderPartials);
	};
});