import {flattenData, toASCII} from '../../../utils';

import {expect} from 'chai';


describe('#Utils/Helpers', () => {

	describe('flattenData()', () => {

		it('should flatten simple object', () => {
			let data = {
				numbers: {
					my: {
						number: 1,
					},
					other: 'ten',
				},
				hours: [1, 5],
				word: '',
			};

			expect(flattenData(data)).to.be.eql([
				['numbers[my][number]', 1],
				['numbers[other]', 'ten'],
				['hours[]', 1],
				['hours[]', 5],
				['word', null],
			]);
		});

	});

	describe('toASCII()', () => {

		it('should transform non ASCII chars to ASCII', () => {
			expect(toASCII('ŁÁŘŠÓÑ')).to.be.equal('LARSON');
			expect(toASCII('Łąřśøń')).to.be.equal('Larson');
		});

	});

});
