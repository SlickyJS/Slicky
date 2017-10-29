import * as webpack from 'webpack';
import * as path from 'path';


export default {
	devtool: 'source-map',

	entry: {
		app: path.join(__dirname, 'app', 'bootstrap.ts'),
		todo: path.join(__dirname, 'app', 'todo', 'bootstrap.ts'),
	},

	output: {
		filename: '[name].bundle.js',
		path: path.join(__dirname, 'public'),
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'commons',
			filename: 'commons.js',
		}),
	],

	resolve: {
		extensions: ['.js', '.json', '.ts'],
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: path.join(__dirname, 'tsconfig.json')
						},
					},
					{
						loader: '@slicky/webpack-loader',
					},
				],
			},
			{test: /\.html$/, use: 'raw-loader'},
			{test: /\.css$/, use: 'raw-loader'},
		],
	},
};
