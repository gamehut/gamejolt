import * as path from 'path';
import { Action, Mutation, namespace, State } from 'vuex-class';

import {
	VuexAction,
	VuexModule,
	VuexMutation,
	VuexStore,
} from '../../../lib/gj-lib-client/utils/vuex';
import { SelfUpdaterInstance, SelfUpdater } from 'client-voodoo';
import * as os from 'os';

export const ClientState = namespace('client', State);
export const ClientAction = namespace('client', Action);
export const ClientMutation = namespace('client', Mutation);

export type ClientUpdateStatus = 'checking' | 'none' | 'fetching' | 'ready' | 'error';

// These are only the public actions/mutations.
export type Actions = {
	bootstrap: undefined;
	checkForClientUpdates: undefined;
	updateClient: undefined;
};

export type Mutations = {};

@VuexModule({
	store: true,
})
export class ClientStore extends VuexStore<ClientStore, Actions, Mutations> {
	private _bootstrapPromise: Promise<void> | null = null;
	private _bootstrapPromiseResolver: Function = null as any;

	// Client updater
	clientUpdateStatus: ClientUpdateStatus = 'none';
	private _updaterInstance: SelfUpdaterInstance | null = null;

	get clientManifestPath() {
		let cwd = path.dirname(process.execPath);
		if (os.type() === 'Darwin') {
			cwd = path.resolve(cwd, '../../../../../../');
		}
		return path.resolve(cwd, '..', '.manifest');
	}

	@VuexAction
	async bootstrap() {
		if (this._bootstrapPromise) {
			return;
		}

		this._startBootstrap();

		console.log('Is GJ updater enabled? ' + (GJ_WITH_UPDATER ? 'yes' : 'no'));
		if (GJ_WITH_UPDATER) {
			this.checkForClientUpdates();
			setInterval(() => this.checkForClientUpdates(), 45 * 60 * 1000); // 45min currently
		}

		this._bootstrapPromiseResolver();
	}

	@VuexMutation
	private _startBootstrap() {
		this._bootstrapPromise = new Promise(resolve => {
			this._bootstrapPromiseResolver = resolve;
		});
	}

	@VuexAction
	async checkForClientUpdates() {
		if (!GJ_WITH_UPDATER) {
			return;
		}

		try {
			console.log('Checking for client update with the new updater.');

			this._setClientUpdateStatus('checking');

			await this._ensureUpdaterInstance();

			console.log('Sending checkForClientUpdates...');
			const checked = await this._updaterInstance!.checkForUpdates();
			if (!checked) {
				throw new Error('Failed to check for updates');
			}
		} catch (err) {
			console.error(err);
			this._setClientUpdateStatus('error');
		}
	}

	@VuexAction
	async updateClient() {
		if (!GJ_WITH_UPDATER) {
			return;
		}

		try {
			console.log('updateClient in clientLibrary store: ' + JSON.stringify(GJ_WITH_UPDATER));
			let updateStarted = false;
			if (this.clientUpdateStatus === 'ready') {
				await this._ensureUpdaterInstance();
				updateStarted = await this._updaterInstance!.updateApply();
			}

			if (!updateStarted) {
				throw new Error('Failed to apply the update');
			}
		} catch (err) {
			console.error(err);
			this._setClientUpdateStatus('error');
		}
	}

	@VuexMutation
	private _setClientUpdateStatus(status: ClientUpdateStatus) {
		console.log('set client update state: ' + status);
		this.clientUpdateStatus = status;
	}

	@VuexMutation
	private _setUpdaterInstance(instance: SelfUpdaterInstance) {
		this._updaterInstance = instance;
	}

	@VuexMutation
	private _clearUpdaterInstance() {
		this._updaterInstance = null;
	}

	@VuexAction
	private async _ensureUpdaterInstance(): Promise<void> {
		if (!this._updaterInstance) {
			console.log('Attaching selfupdater instance for manifest ' + this.clientManifestPath);

			const thisInstance = await SelfUpdater.attach(this.clientManifestPath);
			this._setUpdaterInstance(thisInstance);

			thisInstance
				.on('noUpdateAvailable', () => {
					this._setClientUpdateStatus('none');
				})
				.on('updateAvailable', () => {
					thisInstance
						.updateBegin()
						.catch((err: Error) => {
							console.error(err);
							this._setClientUpdateStatus('error');
						})
						.then(began => {
							if (!began) {
								throw new Error('Failed to begin update');
							}
						});
				})
				.on('updateBegin', () => {
					this._setClientUpdateStatus('fetching');
				})
				.on('updateReady', () => {
					this._setClientUpdateStatus('ready');
				})
				.on('updateApply', () => {
					nw.Window.get().close(true);
				})
				.on('updateFailed', (reason: string) => {
					console.error('Failed to update. Joltron says: ' + reason);
					this._setClientUpdateStatus('error');
				})
				.on('fatal', (err: Error) => {
					console.error(err);
					this._setClientUpdateStatus('error');

					this._disposeUpdaterInstance(thisInstance);
				});
		}
	}

	@VuexAction
	private async _disposeUpdaterInstance(instance: SelfUpdaterInstance) {
		// Try to cleanly disconnect and dispose of the controller so we can try again with a new one.
		try {
			instance.controller.disconnect();
		} catch (err) {}

		// If somehow we failed to disconnect and are processing events even after receiving a fatal event
		instance.removeAllListeners();

		// Setting the instance to null allows the updater to retry with a new one.
		if (this._updaterInstance === instance) {
			this._clearUpdaterInstance();
		}
	}
}

export const store = new ClientStore();
