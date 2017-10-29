import * as path from 'path';


export function getExampleWebpackConfig(root: string): any
{
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
