define(['routes/page'], function (page) {

	return function (app) {
		app.get('/', page.renderIndex);
		app.get('/:name', page.renderPartials);

        //error handlers
        app.use(page.error404handler);
        app.use(page.errorHandler);

	};
});