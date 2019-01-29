const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const multer = require('./middlewares/multer');
const feedRoutes = require('./routes/feed');
const { errorHandler } = require('./util/error-handler');

const app = express();

app.use(bodyParser.json());
app.use(multer.single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/feed', feedRoutes);
app.use(errorHandler);

mongoose
	.connect(
		'mongodb://127.0.0.1:27017/messenger',
		{ useNewUrlParser: true }
	)
	.then(() => {
		app.listen(8080);
	})
	.catch(error => console.error(error));