import {AbstractTokenizer} from '../..';
import {InputStream} from '../..';


export class TestTokenizer extends AbstractTokenizer<string>
{


	protected doReadInput(input: InputStream): string
	{
		input.readWhile((ch: string) => {
			return ch === ' '
		});

		return input.readWhile((ch: string) => {
			return ch !== ' '
		});
	}

}
