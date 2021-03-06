import { RouteConfig } from 'vue-router';

export const routeDashAnalytics: RouteConfig = {
	name: 'dash.analytics',
	path: 'analytics/:resource/:resourceId/:metricKey?',
	// props: true,
	component: () => import(/* webpackChunkName: "routeDashAnalytics" */ './analytics'),
};

// angular.module( 'App.Views' ).config( function( $stateProvider )
// {
// 	$stateProvider.state( 'dash.analytics', {
// 		abstract: true,
// 		url: '/analytics/:resource/:resourceId',
// 		controller: 'Dashboard.AnalyticsCtrl',
// 		controllerAs: 'analyticsCtrl',
// 		templateUrl: require( './analytics.html' ),
// 		resolve: {
// 			payload: function( Api, $stateParams )
// 			{
// 				return Api.sendRequest( '/web/dash/analytics/' + $stateParams.resource + '/' + $stateParams.resourceId );
// 			}
// 		},
// 	} );

// 	$stateProvider.state( 'dash.analytics.view', {
// 		url: '/:period/:metricKey?year&month',
// 		controller: function( $scope, $stateParams )
// 		{
// 			$scope.analyticsCtrl.stateChanged( $stateParams );
// 		},
// 		params: {
// 			period: 'monthly',
// 			metricKey: {
// 				value: '',
// 				squash: true,
// 			},
// 		},
// 	} );
// } );
