import '../bootstrap';

import {Container, Injectable, Inject} from '../../';
import {expect} from 'chai';


let container: Container;


describe('#Container', () => {

	beforeEach(() => {
		container = new Container;
	});

	describe('addService()', () => {

		it('should throw an error when adding service without @Injectable annotation', () => {
			class TestService {}

			expect(() => {
				container.addService(TestService);
			}).to.throw(Error, 'DI: Can not register service "TestService" without @Injectable() annotation.');
		});

		it('should throw en error when adding service with useClass and without @Injectable annotation', () => {
			class TestService {}
			class BetterTestService {}

			expect(() => {
				container.addService(TestService, {
					useClass: BetterTestService,
				});
			}).to.throw(Error, 'DI: Can not register service "TestService". Class "BetterTestService" is without @Injectable() annotation.');
		});

		it('should not throw an error when adding service with useValue', () => {
			class TestService {}

			container.addService(TestService, {
				useValue: true,
			});
		});

		it('should not throw an error when adding service with useFactory', () => {
			class TestService {}

			container.addService(TestService, {
				useFactory: () => true,
			});
		});

		it('should not throw an error when adding service with useExisting', () => {
			class TestService {}

			container.addService(TestService, {
				useExisting: TestService,
			});
		});

	});

	describe('get()', () => {

		it('should return itself', () => {
			expect(container.get(Container)).to.be.equal(container);
		});

		it('should throw an error when getting not registered service', () => {
			class TestService {}

			expect(() => {
				container.get(TestService);
			}).to.throw(Error, 'DI: Service of type "TestService" is not registered in DI container.');
		});

		it('should get simple service', () => {
			@Injectable()
			class TestService {}

			container.addService(TestService);

			expect(container.get(TestService)).to.be.an.instanceOf(TestService);
		});

		it('should get same instances', () => {
			@Injectable()
			class TestService {}

			container.addService(TestService);

			expect(container.get(TestService)).to.be.equal(container.get(TestService));
		});

		it('should get service with useClass', () => {
			class TestService {}

			@Injectable()
			class BetterTestService {}

			container.addService(TestService, {
				useClass: BetterTestService,
			});

			expect(container.get(TestService)).to.be.an.instanceOf(BetterTestService);
		});

		it('should get service with useValue', () => {
			class TestService {}

			container.addService(TestService, {
				useValue: true,
			});

			expect(container.get(TestService)).to.be.equal(true);
		});

		it('should get service with useFactory', () => {
			class TestService {}

			container.addService(TestService, {
				useFactory: () => true,
			});

			expect(container.get(TestService)).to.be.equal(true);
		});

		it('should get service with useExisting', () => {
			@Injectable()
			class TestService {}
			class BetterTestService {}

			container.addService(TestService);
			container.addService(BetterTestService, {
				useExisting: TestService,
			});

			expect(container.get(BetterTestService)).to.be.an.instanceOf(TestService);
		});

		it('should inject other services', () => {
			class Brand {}

			@Injectable()
			class Engine {}

			@Injectable()
			class Car
			{

				constructor(engine: Engine, @Inject(Brand) brand: string)
				{
					expect(engine).to.be.an.instanceOf(Engine);
					expect(brand).to.be.equal('audi');
				}

			}

			@Injectable()
			class Driver
			{

				constructor(car: Car)
				{
					expect(car).to.be.an.instanceOf(Car);
				}

			}

			container.addService(Engine);
			container.addService(Car);
			container.addService(Driver);
			container.addService(Brand, {
				useValue: 'audi',
			});

			expect(container.get(Driver)).to.be.an.instanceOf(Driver);
		});

		it('should use service in @Inject annotation', () => {
			@Injectable()
			class TestService {}

			@Injectable()
			class Application
			{

				constructor(@Inject(TestService) service)
				{
					expect(service).to.be.an.instanceOf(TestService);
				}

			}

			container.addService(TestService);
			container.addService(Application);

			container.get(Application);
		});

	});

	describe('create()', () => {

		it('should create new instance of service', () => {
			class TestService {}

			expect(container.create(TestService)).to.be.an.instanceOf(TestService);
			expect(container.create(TestService)).to.not.be.equal(container.create(TestService));
		});

		it('should create new instance and inject services', () => {
			@Injectable()
			class TestService {}

			class TestApplication
			{

				constructor(@Inject() service: TestService)
				{
					expect(service).to.be.an.instanceOf(TestService);
				}

			}

			container.addService(TestService);

			expect(container.create(TestApplication)).to.be.an.instanceof(TestApplication);
		});

		it('should create new instance with custom providers', () => {
			class TestProvider {}

			class TestApplication
			{


				constructor(@Inject() service: TestProvider)
				{
					expect(service).to.be.an.instanceOf(TestProvider);
				}

			}

			expect(container.create(TestApplication, [
				{service: TestProvider},
			])).to.be.an.instanceOf(TestApplication);
		});

	});

	describe('fork()', () => {

		it('should fork container', () => {
			let fork = container.fork();

			expect(fork).to.be.an.instanceOf(Container);
			expect(fork).to.not.be.equal(container);
		});

		it('should get service from parent', () => {
			@Injectable()
			class TestService {}

			container.addService(TestService);

			let fork = container.fork();

			expect(fork.get(TestService)).to.be.an.instanceOf(TestService);
		});

		it('should overwrite service in fork', () => {
			@Injectable()
			class TestService {}

			@Injectable()
			class BetterTestService extends TestService {}

			let fork = container.fork();

			container.addService(TestService);
			fork.addService(BetterTestService);

			expect(container.get(TestService)).to.be.an.instanceOf(TestService);
			expect(container.get(TestService)).to.not.be.an.instanceOf(BetterTestService);
			expect(fork.get(TestService)).to.not.be.equal(container.get(TestService));
			expect(fork.get(TestService)).to.be.an.instanceOf(BetterTestService);
		});

	});

});
