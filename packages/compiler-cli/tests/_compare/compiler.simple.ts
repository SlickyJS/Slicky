import {Template} from '@slicky/templates-runtime/templates';


function _factory574069480()
{
	return function(_super) {
		_super.childTemplateExtend(Template574069480);
		function Template574069480(application, parent)
		{
			_super.call(this, application, parent);
		}
		Template574069480.prototype.main = function(parent)
		{
			var root = this;
			var tmpl = this;
			tmpl.init();
		};
		return Template574069480;
	}(Template);
}


const _mapping = {
	574069480: _factory574069480
};


export function APP_TEMPLATES_FACTORY(hash: number)
{
	if (typeof _mapping[hash] === 'undefined') {
		throw new Error("Component template " + hash + " does not exists.");
	}

	return _mapping[hash]();
}
