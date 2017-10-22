import {forEach, keys, map} from '@slicky/utils';
import {flattenData, toASCII} from './helpers';
import {FilesList, FileInfo} from '../http';


declare interface LoadedFile
{
	file: File|Blob|FileInfo,
	filename: string,
	content: string,
	type: string,
}


export class MultipartFormSerializer
{


	public static serialize(boundary: string, data: any, files: FilesList, cb: (result: Uint8Array) => void): void
	{
		const result = map(flattenData(data), (item) => {
			return "Content-Disposition: form-data; name=\"" + item[0] + "\"\r\n\r\n" + (item[1] ? item[1] : '') + "\r\n";
		});

		MultipartFormSerializer.serializeFiles(files, (loadedFiles) => {
			forEach(loadedFiles, (file: LoadedFile, name: string) => {
				result.push(
					"Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + toASCII(loadedFiles[name].filename) + "\"\r\n" +
					"Content-Type: " + file.type + "\r\n\r\n" +
					loadedFiles[name].content + "\r\n"
				);
			});

			cb(MultipartFormSerializer.toBinary("--" + boundary + "\r\n" + result.join("--" + boundary + "\r\n") + "--" + boundary + "--\r\n"));
		});
	}


	private static serializeFiles(files: FilesList, cb: (loadedFiles: {[name: string]: LoadedFile}) => void): void
	{
		const total = keys(files).length;

		if (!total) {
			cb({});
		}

		const loaded: {[name: string]: LoadedFile} = {};
		let count = 0;

		forEach(files, (file: File|Blob|FileInfo, name: string) => {
			let filename = null;

			if (!(files[name] instanceof Blob) && !(files[name] instanceof File) && files[name]['filename']) {
				filename = file['filename'];
				file = file['file'];
			}

			if (!filename && file instanceof File) {
				filename = file.name;
			}

			if (!filename) {
				throw new Error('Please, provide filename for file.');
			}

			loaded[name] = {
				file: file,
				filename: filename,
				content: null,
				type: (<File|Blob>file).type,
			};

			((name: string, file: File|Blob) => {
				let reader = new FileReader;

				reader.onload = () => {
					count++;
					loaded[name].content = reader.result;

					if (count === total) {
						cb(loaded);
					}
				};

				reader.readAsBinaryString(file);
			})(name, <File|Blob>file);
		});
	}


	private static toBinary(data): Uint8Array
	{
		let bytes = data.length;
		let result = new Uint8Array(bytes);

		for (let i = 0; i < bytes; i++) {
			result[i] = data.charCodeAt(i) & 0xff;
		}

		return result;
	}

}
