define(['routes/page'], function (page) {

	return function (app) {
		app.get('/', page.renderIndex);
		app.get('/:name', page.renderPartials);

        //error handlers
        app.use(function(req, res, next){
            res.status(404);
            console.log('Not found URL: %s',req.url);
            res.render('layouts/layout');
        });

        app.use(function(err, req, res, next){
            res.status(err.status || 500);
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            res.render('layouts/layout');
        });

	};
});