<?php

include_once __DIR__ . '/image-editor/image-editor.php';


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


class Rich_Image_REST_API extends Pages_REST_API {
	private $name;

	public function setup() {
		register_rest_route(
			self::PAGES_NAMESPACE,
			'/richimage/(?P<mediaID>[\d]+)',
			[
				[
					'methods' => WP_REST_Server::EDITABLE,
					'callback' => [ $this, 'modify_image' ],
					'permission_callback' => [ $this, 'permission_callback' ],
				],
			]
		);
	}

	public function modify_image( WP_REST_Request $request ) {
		$params = $request->get_params();
		$id = $params['mediaID'];
		$action = isset( $params['action'] ) ? $params['action'] : '';

		// Create the image editor
		$editor = new Rich_Image_Editor();
		$modifier = null;

		// Create an image modifier
		if ( $action === 'rotate' && isset( $params['angle'] ) ) {
			$modifier = new Rich_Image_Rotate( $params['angle'] );
		} elseif ( $action === 'flip_v' ) {
			$modifier = new Rich_Image_Flip( 'vertical' );
		} elseif ( $action === 'flip_h' ) {
			$modifier = new Rich_Image_Flip( 'horizontal' );
		} elseif ( $action === 'crop' && isset( $params['cropX'] ) && isset( $params['cropY'] ) && isset( $params['cropWidth'] ) && isset( $params['cropHeight'] ) ) {
			$modifier = new Rich_Image_Crop( $params['cropX'], $params['cropY'], $params['cropWidth'], $params['cropHeight'] );
		}

		if ( $modifier ) {
			// Apply it
			return $editor->modify_image( $id, $modifier );
		}

		return new WP_Error( 'unknown', 'Unknown richimage action' );
	}
}

Pages_REST_API::add_route( new Rich_Image_REST_API() );
