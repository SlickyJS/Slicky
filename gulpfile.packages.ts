import {startsWith, exists, find} from '@slicky/utils';
import * as path from 'path';
import * as fs from 'fs';
import * as merge from 'merge2';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';


const ROOT = path.join(__dirname, 'packages');


declare interface PackageConfig
{
	name: string,
	dependencies: Array<string>,
	root: string,
}


const unsortedPackages = fs.readdirSync(ROOT)
	.map((file) => path.join(ROOT, file))
	.filter((file) => fs.statSync(file).isDirectory())
	.map((directory: string): PackageConfig => {
		const pckg = JSON.parse(<string>fs.readFileSync(path.join(directory, 'package.json'), {encoding: 'utf-8'}));

		return {
			root: directory,
			name: pckg.name.substr(8),
			dependencies: Object.keys(exists(pckg.dependencies) ? pckg.dependencies : {})
				.filter((dependency: string) => startsWith(dependency, '@slicky/'))
				.map((dependency: string) => dependency.substr(8)),
		};
	});


unsortedPackages.forEach((pckg: PackageConfig) => {
	pckg.dependencies = pckg.dependencies.filter((dependency: string) => {
		return exists(find(unsortedPackages, (pckgFind: PackageConfig) => {
			return pckgFind.name === dependency;
		}));
	});
});


const packages: Array<PackageConfig> = [];
const packageExists = (pckg: PackageConfig) => {
	return exists(find(packages, (pckgFind: PackageConfig) => pckgFind === pckg));
};


unsortedPackages.forEach((pckg: PackageConfig) => {
	if (!pckg.dependencies.length) {
		if (packageExists(pckg)) {
			packages.splice(packages.indexOf(pckg), 1);
		}

		return packages.unshift(pckg);
	}

	pckg.dependencies.forEach((dependency: string) => {
		const dependencyPackage = find(unsortedPackages, (pckgFind: PackageConfig) => pckgFind.name === dependency);

		if (!packageExists(dependencyPackage)) {
			packages.push(dependencyPackage);
		}
	});

	if (!packageExists(pckg)) {
		packages.push(pckg);
	}
});


const tasks = [];
packages.forEach((pckg: PackageConfig) => {
	tasks.push(`compile:package:${pckg.name}`);

	gulp.task(`compile:package:${pckg.name}`, () => {
		let project = ts.createProject(path.join(pckg.root, 'tsconfig.json'));

		let result = project.src()
			.pipe(project());

		return merge([
			result.js.pipe(gulp.dest(pckg.root)),
			result.dts.pipe(gulp.dest(pckg.root)),
		]);
	});
});


gulp.task('compile:packages', gulp.series(tasks));
