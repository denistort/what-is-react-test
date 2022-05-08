const MyReact = importMyReact();

/** @jsx MyReact.createElement */

const element = <div>
	<ul>
		<li>Custom JSX parser</li>
		<li>Add Babel</li>
		<li>Add webpack</li>
		<li>Conquer React</li>
		<li>Conquer World</li>
	</ul>
</div>;

MyReact.render(element, document.getElementById("my-react-app"));

//======================================
// **************MYREACT****************
//======================================

function importMyReact(){
	const TEXT_ELEMENT = "TEXT_ELEMENT";

	function render(element, parent) {
		// Get the props and type from element object
		const { type, props } = element;

		// Check if it is a text element
		const isTextElement = type === "TEXT_ELEMENT";

		// Create a new dom element
		const dom = !isTextElement
			? document.createElement(type)
			: document.createTextNode(props.nodeValue);

		// Filter for eventListeners in the props
		const isListener = name => name.startsWith("on");

		// Add eventListeners to the dom element
		Object.keys(props)
			.filter(isListener)
			.forEach(name => {
				const eventType = name.toLowerCase().substring(2);
				dom.addEventListener(eventType, props[name]);
			});

		const isAttribute = name => !isAttribute && name !== "children";

		Object.keys(props)
			.filter(isAttribute)
			.forEach(name => {
				dom[name] = props[name];
			});

		// Check if there are any childrens of the given element
		const childElements = props.children || [];

		// render those childrens recursively first
		childElements.forEach(el => render(el, dom));

		// finally append the element to the parent element
		parent.appendChild(dom);
	}

	function createElement(type, config, ...args) {
		const props = Object.assign({}, config);
		const hasChildren = args.length > 0;

		const allChildren = hasChildren ? [].concat(...args) : [];

		props.children = allChildren
			.filter(child => child !== null && child !== false)
			.map(child => child instanceof Object ? child : createTextElement(child));

		return { type, props };
	}

	function createTextElement(value) {
		return {
			type: TEXT_ELEMENT,
			props: {
				nodeValue: value
			}
		};
	}

	return {createElement: createElement, render: render}
}