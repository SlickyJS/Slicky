import {HTTPRequest, HTTPResponse} from '../http';


export interface Backend
{


	fetch(request: HTTPRequest, cb: (err: Error, response: HTTPResponse) => void): Function;

}
