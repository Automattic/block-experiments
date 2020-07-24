
import { registerBlockType, registerTheme } from 'blockbook-api';

// Register blocks
import * as bauhausCentenaryBlock from '../blocks/bauhaus-centenary/src';
import * as eventBlock from '../blocks/event/src';
import * as motionBackgroundBlock from '../blocks/motion-background/src';
import * as starscapeBlock from '../blocks/starscape/src';
import * as wavesBlock from '../blocks/waves/src';

bauhausCentenaryBlock.registerBlock();
eventBlock.registerBlock();
motionBackgroundBlock.registerBlock();
starscapeBlock.registerBlock();
wavesBlock.registerBlock();

registerBlockType('a8c/bauhaus-centenary');
registerBlockType('a8c/event');
registerBlockType('a8c/motion-background-container');
registerBlockType('a8c/starscape');
registerBlockType('a8c/waves');

// Regiseter themes
import twentyNineteenStyle from '!!raw-loader!./themes/twenty-nineteen.css';
registerTheme( {
	name: 'twenty-nineteen',
	title: 'TwentyNineteen',
	editorStyles: twentyNineteenStyle,
} );