import {Directive, OnInit, OnDestroy, OnTemplateInit, OnAttach, OnUpdate} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective implements OnInit, OnDestroy, OnTemplateInit, OnAttach, OnUpdate
{


	public onInit(): void {}

	public onDestroy(): void {}

	public onTemplateInit(): void {}

	public onAttach(): void {}

	public onUpdate(): void {}

}
