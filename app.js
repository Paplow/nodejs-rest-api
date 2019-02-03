const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const multer = require('./middlewares/multer');
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

app.use(
	'/graphql',
	graphqlHttp({
		schema: graphqlSchema,
		rootValue: graphqlResolver,
		graphiql: true,
		formatError(err) {
			if (!err.originalError) {
				return err;
			}
			const data = err.originalError.data;
			const code = err.originalError.statusCode || 500;
			const message = err.message || 'An error occurred!';

			return { message: message, status: code, data: data };
		}
	})
);
app.use(errorHandler);

mongoose
	.connect('mongodb://127.0.0.1:27017/messenger', { useNewUrlParser: true })
	.then(() => {
		app.listen(8080);
	})
	.catch(error => console.error(error));
