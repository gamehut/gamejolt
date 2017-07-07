import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./active.html';

import { ForumTopic } from '../../../../../lib/gj-lib-client/components/forum/topic/topic.model';
import { Meta } from '../../../../../lib/gj-lib-client/components/meta/meta-service';
import { RouteResolve } from '../../../../../lib/gj-lib-client/utils/router';
import { Api } from '../../../../../lib/gj-lib-client/components/api/api.service';
import { AppForumTopicList } from '../../../../components/forum/topic-list/topic-list';

@View
@Component({
	components: {
		AppForumTopicList,
	},
})
export default class RouteForumsLandingActive extends Vue {
	topics: ForumTopic[] = [];

	routeInit() {
		Meta.title = this.$gettext(`Active Topics in All Forums`);
	}

	@RouteResolve({ cache: true })
	routeResolve() {
		return Api.sendRequest('/web/forums/active-topics');
	}

	routed() {
		this.topics = ForumTopic.populate(this.$payload.topics);
	}
}
