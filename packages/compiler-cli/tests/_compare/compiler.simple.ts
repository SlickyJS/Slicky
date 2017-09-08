import {Template} from '@slicky/templates-runtime/templates';


function _factory3111496796()
{
	return function(_super) {
		_super.childTemplateExtend(Template3111496796);
		function Template3111496796(application, parent)
		{
			_super.call(this, application, parent);
		}
		Template3111496796.prototype.main = function(parent)
		{
			var root = this;
			var tmpl = this;
			tmpl.init();
		};
		return Template3111496796;
	}(Template);
}


const _mapping = {
	3111496796: _factory3111496796
};


export function APP_TEMPLATES_FACTORY(hash: number)
{
	if (typeof _mapping[hash] === 'undefined') {
		throw new Error("Component template " + hash + " does not exists.");
	}

	return _mapping[hash]();
}
