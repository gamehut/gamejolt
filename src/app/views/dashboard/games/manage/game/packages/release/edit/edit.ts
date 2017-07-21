import VueRouter from 'vue-router';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./edit.html';

import { Api } from '../../../../../../../../../lib/gj-lib-client/components/api/api.service';
import { RouteState, RouteStore } from '../../../../manage.store';
import { GamePackage } from '../../../../../../../../../lib/gj-lib-client/components/game/package/package.model';
import { GameRelease } from '../../../../../../../../../lib/gj-lib-client/components/game/release/release.model';
import { GameBuild } from '../../../../../../../../../lib/gj-lib-client/components/game/build/build.model';
import { ModalConfirm } from '../../../../../../../../../lib/gj-lib-client/components/modal/confirm/confirm-service';
import { Growls } from '../../../../../../../../../lib/gj-lib-client/components/growls/growls.service';
import { Meta } from '../../../../../../../../../lib/gj-lib-client/components/meta/meta-service';
// tslint:disable-next-line:max-line-length
import { GameBuildLaunchOption } from '../../../../../../../../../lib/gj-lib-client/components/game/build/launch-option/launch-option.model';
import { FormGameRelease } from '../../../../../../../../components/forms/game/release/release';
import { AppJolticon } from '../../../../../../../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import {
	BaseRouteComponent,
	RouteResolve,
} from '../../../../../../../../../lib/gj-lib-client/components/route/route-component';

@View
@Component({
	components: {
		AppJolticon,
		FormGameRelease,
	},
})
export default class RouteDashGamesManageGamePackageReleaseEdit extends BaseRouteComponent {
	@RouteState game: RouteStore['game'];

	package: GamePackage = null as any;
	release: GameRelease = null as any;
	releases: GameRelease[] = [];
	builds: GameBuild[] = [];
	launchOptions: GameBuildLaunchOption[] = [];
	buildDownloadCounts: { [buildId: number]: number } = {};
	areBuildsLockedByJam = false;
	areWebBuildsLockedBySellable = false;

	@RouteResolve()
	routeResolve(this: undefined, route: VueRouter.Route) {
		return Api.sendRequest(
			'/web/dash/developer/games/releases/' +
				route.params.id +
				'/' +
				route.params.packageId +
				'/' +
				route.params.releaseId
		);
	}

	routed() {
		this.package = new GamePackage(this.$payload.package);
		this.release = new GameRelease(this.$payload.release);
		this.releases = GameRelease.populate(this.$payload.releases);
		this.builds = GameBuild.populate(this.$payload.builds);
		this.launchOptions = GameBuildLaunchOption.populate(this.$payload.launchOptions);

		this.buildDownloadCounts = this.$payload.buildDownloadCounts || {};
		// If the server has no build counts it returns an empty array instead of an empty object.
		// This is an issue with the backend not explicitly casting empty arrays to objects.
		if (Array.isArray(this.buildDownloadCounts)) {
			this.buildDownloadCounts = {};
		}

		// If the game was entered into a jam that locks its builds.
		this.areBuildsLockedByJam = this.$payload.areBuildsLockedByJam || false;
		this.areWebBuildsLockedBySellable =
			this.$payload.package.is_in_paid_sellable || this.$payload.package.has_sales || false;

		Meta.title = this.$gettextInterpolate('Edit Release %{ release } - %{ package } - %{ game }', {
			game: this.game.title,
			package: this.package.title || this.game.title,
			release: this.release.version_number,
		});
	}

	onSaved() {
		this.$router.push({
			name: 'dash.games.manage.game.packages.edit',
			params: {
				packageId: this.package.id + '',
			},
		});
	}

	async unpublishRelease(release: GameRelease) {
		const result = await ModalConfirm.show(
			this.$gettext('dash.games.releases.manage.unpublish_release_confirmation')
		);

		if (!result) {
			return;
		}

		await release.$unpublish(this.game);

		Growls.success(
			this.$gettext('dash.games.releases.manage.unpublish_release_growl'),
			this.$gettext('dash.games.releases.manage.unpublish_release_growl_title')
		);
	}

	async removeRelease(release: GameRelease) {
		const result = await ModalConfirm.show(
			this.$gettext('dash.games.releases.manage.remove_release_confirmation')
		);

		if (!result) {
			return;
		}

		await release.$remove(this.game);

		Growls.success(
			this.$gettext('dash.games.releases.manage.remove_release_growl'),
			this.$gettext('dash.games.releases.manage.remove_release_growl_title')
		);

		this.$router.push({
			name: 'dash.games.manage.game.packages.edit',
			params: {
				packageId: this.package.id + '',
			},
		});
	}
}
