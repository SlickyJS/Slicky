function _factory2377967077()
{
	return function(template, el, component) {

	};
}


function _factory2770134629()
{
	return function(template, el, component) {

	};
}


const _mapping = {
	2377967077: _factory2377967077,
	2770134629: _factory2770134629
};


export function APP_TEMPLATES_FACTORY(hash: number)
{
	if (typeof _mapping[hash] === 'undefined') {
		throw new Error("Component template " + hash + " does not exists.");
	}

	return _mapping[hash]();
}
