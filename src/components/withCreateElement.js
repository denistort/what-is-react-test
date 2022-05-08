import {MyReact} from "../core/React";
import logoPng from "../assets/logo.png";

const LoadingDiv = () => {
	return MyReact.createElement('div', {
		className: 'loading',
	}, 'Loading...')
}
const Header = () => {
	return MyReact.createElement('header', {
		className: 'header',
	}, MyReact.createElement(Logo))
}
const Logo = () => {
	return MyReact.createElement('img', {className: 'logo', src: logoPng})
}
const Clock = ({time}) => {
	return MyReact.createElement('div', {
			className: 'clock',
		},
		time.toLocaleString())
}
const Lot = ({lot}) => {
	const lotChildren = [
		MyReact.createElement('div', { className: 'price' }, lot.price),
		MyReact.createElement('h1', {}, lot.name),
		MyReact.createElement('p', { className: 'description' }, lot.description)
	]
	return MyReact.createElement('article', { className: 'lot', key: lot.id },
		...lotChildren)
}
const Lots = ({lots = []}) => {
	if (lots === null) {
		return MyReact.createElement(LoadingDiv)
	}
	if (lots.length) {
		return MyReact.createElement('div', {className: 'lots' }, lots.map(lot => ({
			type: Lot,
			props: {lot}
		})))
	}
}
const App = ({state}) => {
	const children = [
		MyReact.createElement(Header),
		MyReact.createElement(Clock, { time: state.time}),
		MyReact.createElement(Lots, {lots: state.lots})
	]
	return MyReact.createElement('div', { className: 'app' }, ...children)
}