const puppeteer = require( 'puppeteer' );
const url = require( 'url' );
const targetDir = process.argv[ 2 ];

// PUPPETEER_PRODUCT=firefox npm i puppeteer
// PUPPETEER_PRODUCT=chrome npm i puppeteer
// 127.0.0.1 alvesstarter.wordpress.com balasanastarter.wordpress.com barnsburystarter.wordpress.com bowenstarterdesign.wordpress.com bricestarter.wordpress.com camdemstarter.wordpress.com casselstarter.wordpress.com coutoirestarter.wordpress.com doylestarter.wordpress.com easleystarter.wordpress.com edisonstarter.wordpress.com gibbsstarter.wordpress.com levenstarter.wordpress.com maylandstarter.wordpress.com maywoodstarter.wordpress.com overtonstarter.wordpress.com reynoldsstarter.wordpress.com rivingtonstarter.wordpress.com rockfieldstarter.wordpress.com stratfordstarter.wordpress.com vestastarter.wordpress.com
const templates = [
	'https://alvesstarter.wordpress.com/',
	'https://balasanastarter.wordpress.com/',
	'https://barnsburystarter.wordpress.com/',
	'https://bowenstarterdesign.wordpress.com/',
	'https://bricestarter.wordpress.com/',
	'https://camdemstarter.wordpress.com/',
	'https://casselstarter.wordpress.com/',
	'https://coutoirestarter.wordpress.com/',
	'https://doylestarter.wordpress.com/',
	'https://easleystarter.wordpress.com/',
	'https://edisonstarter.wordpress.com/',
	'https://gibbsstarter.wordpress.com/',
	'https://levenstarter.wordpress.com/',
	'https://maylandstarter.wordpress.com/',
	'https://maywoodstarter.wordpress.com/',
	'https://overtonstarter.wordpress.com/',
	'https://reynoldsstarter.wordpress.com/',
	'https://rivingtonstarter.wordpress.com/',
	'https://rockfieldstarter.wordpress.com/',
	'https://stratfordstarter.wordpress.com/',
	'https://vestastarter.wordpress.com/',
];

( async () => {
	const browsers = [ 'firefox' ];

	for ( let pos = 0; pos < browsers.length; pos++ ) {
		const browser = await puppeteer.launch( { product: browsers[ pos ] } );

		for ( let index = 0; index < templates.length; index++ ) {
			const templateUrl = url.parse( templates[ index ] );
			const page = await browser.newPage();
			const urlParts = templateUrl.host.split( '.' );
			await page.goto( templates[ index ] );
			await page.screenshot( {
				path:
					targetDir +
					'/' +
					browsers[ pos ] +
					'/' +
					urlParts[ 0 ] +
					'.png',
				fullPage: true,
			} );

			console.log( templates[ index ] );
		}

		await browser.close();
	}
} )();
