import {Directive, OnInit, OnDestroy, OnTemplateInit, OnUpdate, OnAttach} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective implements OnInit, OnDestroy, OnTemplateInit, OnUpdate, OnAttach
{

	onInit() {}

	onDestroy() {}

	onTemplateInit() {}

	onUpdate() {}

	onAttach() {}

}
