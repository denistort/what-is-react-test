import { renderWithVirtual } from './sync';

export class MyReact {

	static createElement(type, props = {}, ...children) {
		const key = props.key ? props.key: null;
		if(children.length === 1) {
			props.children = children[0]
		} else {
			props.children = children;
		}
		return {
			type,
			key,
			props
		}
	}

	static render(virtualDOM, realDOMRoot) {
		renderWithVirtual(virtualDOM, realDOMRoot)
	}
}