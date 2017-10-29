import * as path from 'path';
import * as fs from 'fs';


export function getExampleWebpackConfig(root: string): any
{
	if (fs.existsSync(path.join(root, 'webpack.config.ts'))) {
		return require(path.join(root, 'webpack.config.ts')).default;
	}

	return {
		devtool: 'source-map',

		entry: {
			app: path.join(root, 'app', 'bootstrap.ts'),
		},

		output: {
			path: path.join(root, 'public'),
			filename: 'app.js',
		},

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
								configFile: path.join(root, 'tsconfig.json')
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
}
