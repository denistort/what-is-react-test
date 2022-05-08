/**
 * Функция которая на вход принимает виртуальный дом и реальный и рендерит
 * @param virtualDOM
 * @param realDOMRoot
 */
export const renderWithVirtual = (virtualDOM, realDOMRoot) => {
	const evaluatedVirtualDom = evaluate(virtualDOM);

	const atr = {};
	for (let i = 0; i < realDOMRoot.attributes.length; i++) {
		const item = realDOMRoot.attributes[i]
		if(item.name === 'class') {
			atr['className'] = item.value
		} else {
			atr[item.name] = item.value
		}
	}
	const virtualDomRoot = {
		type: realDOMRoot.tagName.toLowerCase(),
		props: {
			id: realDOMRoot.id,
			...atr,
			children: [
				evaluatedVirtualDom
			]
		}
	}
	sync(virtualDomRoot, realDOMRoot);
}

/**
 * Самый примитивный рендер
 * Полный перерендер
 * @param newDom
 * @param realDomRoot
 */
export const simpleRender = (newDom, realDomRoot) => {
	realDomRoot.innerHTML = '';
	realDomRoot.append(newDom)
}


/**
 * Непосредственно функция синхронизации
 * @param virtualNode
 * @param realNode
 */
export const sync = (virtualNode, realNode) => {
	/*
	* SYNC ELEMENT
	* если виртуальная нода не равна реальной то реальную приводим к реальной
	* */

	if (virtualNode.props) {
		const isListener = name => name.startsWith("on");

		// Add eventListeners to the dom element
		Object.keys(virtualNode.props)
			.filter(isListener)
			.forEach(name => {
				const eventType = name.toLowerCase().substring(2);
				realNode.addEventListener(eventType, virtualNode.props[name]);
				// debugger
			});

		Object.entries(virtualNode.props).forEach(([name, value]) => {
			if (!isListener(name)) {
				if (name === 'children' || name === 'key') {
					return
				}
				if (realNode[name] !== value) {
					realNode[name] = value;
				}
			}
			// if(isListener(name)) {
			// 	const eventType = name.toLowerCase().substring(2);
			// 	realNode.addEventListener(eventType, virtualNode.props[name]);
			// }
		})
	}
	if (virtualNode.key) realNode.dataset.key = virtualNode.key;

	/*
	* SYNC TEXT NODE
	* Синхронизация текста
	* */
	if (typeof virtualNode !== 'object' && virtualNode !== realNode.nodeValue) {
		realNode.nodeValue = virtualNode;
	}

	//Обнуление реального дом дерева
	// realNode.innerHTML = '';
	/*
	* SYNC CHILD
	* синхронизация всех дочерних элементов
	* */
	const virtualChildren = virtualNode.props ? virtualNode.props.children || [] : [];
	const realChildren = realNode.childNodes;

	for (let i = 0; i < virtualChildren.length || i < realChildren.length; i++) {
		const virtual = virtualChildren[i];
		const real = realChildren[i];

		// REMOVE
		if (virtual === undefined && real !== undefined) {
			realNode.remove(real);
		}
		// ADD
		if (virtual !== undefined && real === undefined) {
			const newReal = createNodeByVirtual(virtual)
			sync(virtual, newReal);
			realNode.appendChild(newReal);
		}
		// UPDATE
		if (virtual !== undefined && real !== undefined && (virtual.type || '') === (real.tagName || '').toLowerCase()) {
			sync(virtual, real)
		}
		// REPLACE
		if (virtual !== undefined && real !== undefined && (virtual.type || '') !== (real.tagName || '').toLowerCase()) {
			const newReal = createNodeByVirtual(virtual)
			sync(virtual, newReal)
			realNode.replaceChild(newReal, real)
		}
	}

}

const createNodeByVirtual = (virtual) => (
	typeof virtual !== 'object'
		? document.createTextNode('')
		: document.createElement(virtual.type)
)

function evaluate(virtualNode) {
	if (typeof virtualNode !== 'object') {
		return virtualNode
	}
	if (typeof virtualNode.type === 'function') {
		return evaluate((virtualNode.type)(virtualNode.props))
	}
	const props = virtualNode.props || {}
	// debugger
	return {
		...virtualNode,
		props: {
			...props,
			children: Array.isArray(props.children)
				? props.children.map(evaluate)
				: [evaluate(props.children)],
		}
	}
}
export default {renderWithVirtual, simpleRender};