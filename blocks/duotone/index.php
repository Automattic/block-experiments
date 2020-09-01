<?php

include_once __DIR__ . '/src/cover/index.php';
include_once __DIR__ . '/src/image/index.php';

add_action( 'init', function() {
	wp_set_script_translations( 'block-experiments', 'duotone' );
} );
