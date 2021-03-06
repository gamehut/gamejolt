import View from '!view!./payment-methods.html';
import { Component } from 'vue-property-decorator';

import {
	BaseRouteComponent,
	RouteResolve,
} from '../../../../../lib/gj-lib-client/components/route/route-component';
import { PaymentSource } from '../../../../../lib/gj-lib-client/components/payment-source/payment-source.model';
import { Api } from '../../../../../lib/gj-lib-client/components/api/api.service';
import { RouteMutation, RouteStore } from '../account.store';
import { arrayRemove } from '../../../../../lib/gj-lib-client/utils/array';
import { AppUserPaymentSourceCard } from '../../../../components/user/payment-source/card/card';

@View
@Component({
	name: 'RouteDashAccountPaymentMethods',
	components: {
		AppUserPaymentSourceCard,
	},
})
export default class RouteDashAccountPaymentMethods extends BaseRouteComponent {
	@RouteMutation setHeading: RouteStore['setHeading'];

	paymentSources: PaymentSource[] = [];

	@RouteResolve()
	routeResolve(this: undefined) {
		return Api.sendRequest('/web/dash/payment-methods');
	}

	get routeTitle() {
		return this.$gettext(`Payment Methods`);
	}

	get hasPaymentSources() {
		return this.paymentSources.length > 0;
	}

	routeInit() {
		this.setHeading(this.routeTitle);
	}

	routed($payload: any) {
		this.paymentSources = PaymentSource.populate($payload.paymentSources);
	}

	onRemove(source: PaymentSource) {
		arrayRemove(this.paymentSources, i => i.id === source.id);
	}
}
