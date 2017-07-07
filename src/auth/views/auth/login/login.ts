import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./login.html';

import { Meta } from '../../../../lib/gj-lib-client/components/meta/meta-service';
import { AppJolticon } from '../../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { AppAuthLogin } from '../../../../lib/gj-lib-client/components/auth/login/login';
import { RouteResolve } from '../../../../lib/gj-lib-client/utils/router';
import { loggedUserBlock } from '../auth';
import { UserLinkedAccounts } from '../../../../lib/gj-lib-client/components/user/linked-accounts/linked-accounts.service';

@View
@Component({
	components: {
		AppJolticon,
		AppAuthLogin,
	},
})
export default class RouteAuthLogin extends Vue {
	redirect = '';

	@RouteResolve()
	routeResolve() {
		return loggedUserBlock();
	}

	routeInit() {
		Meta.title = this.$gettext('auth.login.page_title');
		this.redirect = this.$route.query.redirect || '';
	}

	linkedAccountLogin(provider: any) {
		UserLinkedAccounts.login(this.$router, provider);
	}
}
