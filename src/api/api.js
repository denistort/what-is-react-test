class Api {
	constructor() {}
	get(url) {
		switch (url) {
			case '/lots':
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve([
							{
								id: 1,
								name: 'Apple',
								description: 'Apple description',
								price: 16
							},
							{
								id: 2,
								name: 'Orange',
								description: 'Orange description',
								price: 32
							},
							{
								id: 3,
								name: 'Cucumber',
								description: 'Cucumber description',
								price: 40
							},
							{
								id: 4,
								name: 'Dildos',
								description: 'Dildos description',
								price: 32
							},
						])
					}, 2000)
				})
			default: break;
		}
	}
}

export default Api;