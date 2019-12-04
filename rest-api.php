<?php

class Pages_REST_API extends WP_REST_Controller {
	const PAGES_NAMESPACE = 'pages/v1';
	static $routes = [];

	public static function add_route( $route ) {
		self::$routes[] = $route;
	}

	public function __construct() {
	}

	public function permission_callback() {
		return is_user_logged_in();
	}

	protected function proxy_wpcom_request( $url ) {
		$token = get_user_meta( get_current_user_id(), 'wpcc_token', true );

		return wp_remote_get(
			$url,
			[
				'headers' => [
					'Authorization' => 'Bearer ' . $token,
				],
			]
		);
	}
}

add_action( 'rest_api_init', function() {
	foreach ( Pages_REST_API::$routes as $route ) {
		$route->setup();
	}
} );
