import { RouteConfig } from 'vue-router';

export const routeDashMainPurchasesList: RouteConfig = {
	name: 'dash.main.purchases.list',
	path: 'purchases',
	props: true,
	component: () => import(/* webpackChunkName: "routeDashMainPurchasesList" */ './list'),
};
