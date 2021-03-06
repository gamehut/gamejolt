import Vue from 'vue';
import { ActivityFeedItem, ActivityFeedInput } from './item-service';
import { FiresidePost } from '../../../../lib/gj-lib-client/components/fireside/post/post-model';
import { Api } from '../../../../lib/gj-lib-client/components/api/api.service';
import { Notification } from '../../../../lib/gj-lib-client/components/notification/notification-model';
import { arrayRemove } from '../../../../lib/gj-lib-client/utils/array';
import { EventItem } from '../../../../lib/gj-lib-client/components/event-item/event-item.model';
import { Analytics } from '../../../../lib/gj-lib-client/components/analytics/analytics.service';
import { Game } from '../../../../lib/gj-lib-client/components/game/game.model';

export interface ActivityFeedContainerOptions {
	/**
	 * Which types of models are used in the feed.
	 */
	type: 'Fireside_Post' | 'Notification' | 'EventItem';

	/**
	 * The URL to hit to load more from the feed.
	 */
	url: string;

	/**
	 * Disables infinite scroll.
	 */
	noAutoload?: boolean;

	/**
	 * A timestamp of when the notifications in this feed were last viewed.
	 */
	notificationWatermark?: number;
}

export class ActivityFeedContainer {
	feedType: 'Notification' | 'Fireside_Post' | 'EventItem';
	items: ActivityFeedItem[] = [];
	games: { [k: number]: Game } = {};

	notificationWatermark = 0; // Timestamp.
	reachedEnd = false;

	viewedItems: string[] = [];
	expandedItems: string[] = [];
	bootstrappedItems: { [k: string]: null } = {};
	hydratedItems: { [k: string]: null } = {};
	activeItem: ActivityFeedItem | null = null;
	scroll = 0;
	noAutoload = false;
	isLoadingMore = false;
	timesLoaded = 0;
	private loadMoreUrl: string;

	get hasItems() {
		return this.items.length > 0;
	}

	constructor(items: ActivityFeedInput[], options: ActivityFeedContainerOptions) {
		this.append(items);

		this.feedType = options.type;
		this.loadMoreUrl = options.url;
		this.noAutoload = options.noAutoload || false;

		if (typeof options.notificationWatermark !== 'undefined') {
			this.notificationWatermark = options.notificationWatermark;
		}
	}

	prepend(input: ActivityFeedInput[]) {
		this.addItems(input, 'start');
	}

	append(input: ActivityFeedInput[]) {
		this.addItems(input, 'end');
	}

	private addItems(input: ActivityFeedInput[], position: 'start' | 'end' = 'start') {
		const items = input.map(item => new ActivityFeedItem(item));

		if (position === 'start') {
			this.items = items.concat(this.items);
		} else if (position === 'end') {
			this.items = this.items.concat(items);
		}

		this.processGames();

		// We bootstrap right away. We only use bootstrapping for going back into the feeds.
		for (const i of items) {
			Vue.set(this.bootstrappedItems, i.id, null);
		}
	}

	update(_input: ActivityFeedInput) {
		this.processGames();
	}

	remove(input: ActivityFeedInput) {
		const item = new ActivityFeedItem(input);
		arrayRemove(this.items, i => i.type === item.type && i.feedItem.id === item.feedItem.id);
		this.processGames();
	}

	viewed(item: ActivityFeedItem) {
		if (this.viewedItems.indexOf(item.id) !== -1) {
			return;
		}

		this.viewedItems.push(item.id);
		item.$viewed();
	}

	expanded(item: ActivityFeedItem) {
		if (this.expandedItems.indexOf(item.id) !== -1) {
			return;
		}

		this.expandedItems.push(item.id);
		item.$expanded();

		Analytics.trackEvent('activity-feed', 'expanded-item');
	}

	inViewChange(item: ActivityFeedItem, visible: boolean) {
		if (visible) {
			Vue.set(this.bootstrappedItems, item.id, null);
			Vue.set(this.hydratedItems, item.id, null);
			this.viewed(item);
		} else {
			Vue.delete(this.hydratedItems, item.id);
		}
	}

	resetBootstrapped() {
		this.bootstrappedItems = {};
	}

	async loadMore() {
		if (this.isLoadingMore || this.reachedEnd) {
			return;
		}

		this.isLoadingMore = true;
		++this.timesLoaded;

		const lastPost = this.items[this.items.length - 1];

		const response = await Api.sendRequest(this.loadMoreUrl, {
			scrollId: lastPost.scrollId,
		});

		this.isLoadingMore = false;

		if (!response.items || !response.items.length) {
			this.reachedEnd = true;
			Analytics.trackEvent('activity-feed', 'reached-end');
			return;
		}

		if (this.feedType === 'Notification') {
			this.append(Notification.populate(response.items));
		} else if (this.feedType === 'Fireside_Post') {
			this.append(FiresidePost.populate(response.items));
		} else if (this.feedType === 'EventItem') {
			this.append(EventItem.populate(response.items));
		}

		Analytics.trackEvent('activity-feed', 'loaded-more', 'page-' + this.timesLoaded);
	}

	/**
	 * This ensures that any reference to a particular game any of the feed items are shared across
	 * all items. It not only reduces mem usage, but also helps to keep things in sync (game
	 * follows, etc).
	 */
	private processGames() {
		for (const item of this.items) {
			if (item.feedItem instanceof FiresidePost || item.feedItem instanceof EventItem) {
				const game = item.feedItem.game;
				if (game) {
					if (!this.games[game.id]) {
						Vue.set(this.games as any, game.id, game);
					} else {
						item.feedItem.game = this.games[game.id];
					}
				}
			}
		}
	}
}
