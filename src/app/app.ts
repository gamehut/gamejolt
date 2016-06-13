import 'reflect-metadata';
import { bootstrap } from 'ng-metadata/platform';

import { AppCtrl } from './app-controller';
import { App } from './app-service';

import './views/views';

import { ModelModule } from './../lib/gj-lib-client/components/model/model';

import { FiresidePostModule } from './../lib/gj-lib-client/components/fireside/post/post';
import { FiresidePostTagModule } from './../lib/gj-lib-client/components/fireside/post/tag/tag';
import { FiresidePostLikeModule } from './../lib/gj-lib-client/components/fireside/post/like/like';
import { FiresidePostLikeWidgetModule } from './../lib/gj-lib-client/components/fireside/post/like/widget/widget';

import { DevlogFeedModule } from './components/devlog/feed/feed';
import { DevlogPostTextModule } from './components/devlog/post/text/text';
import { DevlogPostControlsModule } from './components/devlog/post/controls/controls';

const AppModule = angular.module( 'App', [
	// Set the event tracking up first.
	'gj.ErrorTracking',

	// Libs.
	'ngSanitize',
	'ngAnimate',
	'ui.router',
	'oc.lazyLoad',

	'ui.bootstrap.collapse',
	'angularMoment',
	'cfp.hotkeys',
	'ui.bootstrap.modal',
	'ui.keypress',
	'validation.match',
	'angular-inview',

	'rzModule',

	// GJ lib.
	'gj.Translate',
	'gj.Translate.LangSelector',
	'gj.Geo',
	'gj.Environment',
	'gj.Api',
	'gj.Payload',
	ModelModule,
	'gj.Error',
	'gj.Meta',

	'gj.Filesize',
	'gj.Time',
	'gj.Duration',
	'gj.FuzzyNumber',
	'gj.Fuzzysearch',
	'gj.Currency',

	'gj.Debug',
	'gj.Debug.DebugBar',
	'gj.Ruler',
	'gj.Screen',
	'gj.BodyClasses',
	'gj.Analytics',
	'gj.Loading',
	'gj.Loading.LoadingPageTransition',
	'gj.Scroll',
	'gj.Typography',
	'gj.ExpandWhen',
	'gj.UiTree.Placeholder',
	'gj.Device',
	'gj.Location',
	'gj.Connection',
	'gj.Permalink',

	'gj.Partial',
	'gj.Backdrop',
	'gj.Tooltip',
	'gj.Popover',
	'gj.ToggleSwitch',
	'gj.Growls',
	'gj.Scroll.Parallax',
	'gj.Scroll.Affix',
	'gj.Scroll.AutoScroll',
	'gj.Scroll.FixedResizer',
	'gj.EditableAccordion',
	'gj.Referrer',
	'gj.HistoryTick',
	'gj.Pagination',
	'gj.Modal.Confirm',
	'gj.SiteSelector',
	'gj.Favicon',
	'gj.FadeCollapse',
	'gj.Progress.Poller',
	'gj.Alert.Dismissable',
	'gj.Lazy.Placeholder',
	'gj.Registry',
	'gj.Clipboard',

	'gj.History',
	'gj.History.Cache',

	'gj.Report.Form',
	'gj.Report.Modal',

	'gj.Primus',
	'gj.Activity.Stream',

	'gj.Graph',
	'gj.Graph.Table',
	'gj.Graph.Widget',

	'gj.Form',
	'gj.Form.MarkdownEditor',
	'gj.Form.UploadControl',

	'gj.User',
	'gj.User.UserAvatar',
	'gj.User.LinkedAccounts',
	'gj.User.Friendship',
	'gj.User.Message',
	'gj.Notification',
	'gj.Comment',
	'gj.Comment.Vote',
	'gj.Comment.Widget',
	'gj.Subscription',
	'gj.Ad',
	'gj.Ad.Video',
	'gj.MediaItem',

	'gj.Game',
	'gj.Game.Rating',
	'gj.Game.Screenshot',
	'gj.Game.Video',
	'gj.Game.Song',
	'gj.Game.Package',
	'gj.Game.Release',
	'gj.Game.Build',
	'gj.Game.Build.File',
	'gj.Game.Build.Param',
	'gj.Game.Build.LaunchOption',
	'gj.Sellable',
	'gj.Sellable.Pricing',
	'gj.KeyGroup',
	'gj.Game.NewsArticle',
	'gj.Game.Trophy',
	'gj.Game.ScoreTable',
	'gj.Game.DataStore.Item',

	'gj.Order',
	'gj.Order.Item',
	'gj.Order.Payment',
	'gj.Order.Payment.Refund',
	'gj.Order.Address',

	'gj.Game.Package.Card',
	'gj.Game.Downloader',
	'gj.Game.PlayModal',

	'gj.Game.KeyPool',

	'gj.Jam',
	'gj.Jam.Game',
	'gj.Jam.VotingCategory',
	'gj.Jam.Game.Vote',
	'gj.Jam.Game.Vote.Widget',
	'gj.Jam.Award',

	'gj.Key',
	'gj.LinkedKey',

	'gj.Translation',

	'gj.Chat.Room',

	'gj.Social.Twitter.Sdk',
	'gj.Social.Twitter.Share',
	'gj.Social.Twitter.Follow',
	'gj.Social.Facebook.Sdk',
	'gj.Social.Facebook.Like',
	'gj.Social.Facebook.Share',
	'gj.Social.Facebook.Send',

	'gj.GameLibrary.Game',

	'gj.User.GameScore',
	'gj.User.GameTrophy',
	'gj.User.GameSession',

	'gj.Audio.Player',
	'gj.Audio.Scrubber',
	'gj.Audio.Playlist',
	'gj.Game.Soundtrack.Card',

	'gj.GamePlaylist',
	'gj.GamePlaylist.Game',

	'gj.GameBundle',

	FiresidePostModule,
	FiresidePostTagModule,
	FiresidePostLikeModule,
	FiresidePostLikeWidgetModule,

	'gj.Forum.Category',
	'gj.Forum.Channel',
	'gj.Forum.Topic',
	'gj.Forum.Post',

	'gj.Img.Helper',
	'gj.Img.Crop',
	'gj.Img.ImgResponsive',

	'gj.WidgetCompiler',

	// Components.
	'App.ProtocolWatcher',
	'App.SplitTest',
	'App.Chat',
	'App.Shell',
	'App.Offline.Alert',
	'App.Search',
	'App.Friends',
	'App.Notifications',
	'App.Minbar',
	'App.Invite',
	'App.Sorting',
	'App.Settings',
	'App.MediaItem.Cover',
	'App.PageHeader',

	'App.Forms',

	'App.FeaturedItem',

	'App.Activity.Feed',
	'App.Notifications.DescriptiveAction',

	'App.Genre.List',

	DevlogFeedModule,
	DevlogPostTextModule,
	DevlogPostControlsModule,

	'App.Post.Grid',
	'App.Post.List',

	'App.Game.Thumbnail',
	'App.Meter',
	'App.Game.CompatIcons',
	'App.Game.Grid',
	'App.Game.Filtering',
	'App.Game.CoverButtons',
	'App.Game.MediaBar',
	'App.Game.Ogrs',
	'App.Game.RatingGrowl',
	'App.Game.Video.Embed',
	'App.Game.MaturityBlock',

	'App.Comment.AvatarList',

	'App.Channels',

	'App.Game.Collection',
	'App.Game.Collection.Thumbnail',
	'App.Game.Collection.Grid',
	'App.Game.Collection.List',

	'App.Rating.Widget',

	'App.GamePlaylist.SaveModal',
	'App.GamePlaylist.AddToPopover',

	'App.Score.List',
	'App.Score.Feed',
	'App.Score.Overview',
	'App.Score.ScoreboardPopover',

	'App.Trophy.Thumbnail',
	'App.Trophy.List',
	'App.Trophy.Completion',
	'App.Trophy.Overview',

	'App.User.LevelWidget',
	'App.User.TokenModal',
	'App.User.SetPasswordModal',
	'App.User.FriendshipsHelper',

	'App.Terms.ChangeAlert',

	// Views.
	'App.Views',

	// Client.
	/* inject client:modules */
] )
.service( 'App', App )
.controller( 'AppCtrl', AppCtrl )
.config( function( $locationProvider, $uiViewScrollProvider, $compileProvider, $httpProvider, EnvironmentProvider, $ocLazyLoadProvider, $sceDelegateProvider, amTimeAgoConfig, TranslateProvider )
{
	$sceDelegateProvider.resourceUrlWhitelist( [
		'self',
		'https://b6d3e9q9.ssl.hwcdn.net/**',
	] );

	$locationProvider.html5Mode( true ).hashPrefix( '!' );
	$uiViewScrollProvider.useAnchorScroll();

	$compileProvider.debugInfoEnabled( false );
	$httpProvider.useApplyAsync( true );

	$ocLazyLoadProvider.config( {
		loadedModules: [ 'App' ]  // Hardcoded so it doesn't have to search DOM for it.
	} );

	amTimeAgoConfig.fullDateThreshold = 30;
	amTimeAgoConfig.fullDateFormat = 'll';

	// We are on WTTF!
	EnvironmentProvider.isWttf = true;

	// Desktop client.
	if ( EnvironmentProvider.isClient ) {

		// Some libraries attach onto global instead of window for node-webkit
		// because they think they're in nodejs context. Just pull back over to window.
		if ( typeof window._ == 'undefined' ) {
			window._ = global._;
		}

		if ( typeof window.moment == 'undefined' ) {
			window.moment = global.moment;
		}

		// Can't use push/popstate URLs for node-webkit.
		// Must be accessed like a local file with index.html at the root.
		$locationProvider.html5Mode( false );

		// Since we're using the "app://" protocol, we have to change the sanitization whitelist
		// to include the app protocol as well. Otherwise we get "unsafe:" prefixed onto certain URLs.
		$compileProvider.aHrefSanitizationWhitelist( /^\s*(https?|ftp|mailto|tel|file|app):/ );
		$compileProvider.imgSrcSanitizationWhitelist( /^\s*((https?|ftp|file|blob|app):|data:image\/)/ );
	}

	// Can't include in a foreach. Have to list out so that the revisioner for filenames will pull it.
	var languages = {
		main: {
			'en': '/translations/en/main.json',
			'en_US': '/translations/en_US/main.json',
			'en_AU': '/translations/en_AU/main.json',
			'nl': '/translations/nl/main.json',
			'ro': '/translations/ro/main.json',
			'de': '/translations/de/main.json',
			'es': '/translations/es/main.json',
			'fr': '/translations/fr/main.json',
			'ru': '/translations/ru/main.json',
			'sv': '/translations/sv/main.json',
			'tr': '/translations/tr/main.json',
			'pt': '/translations/pt/main.json',
			'pt_BR': '/translations/pt_BR/main.json',
			'fi': '/translations/fi/main.json',
			'nb': '/translations/nb/main.json',
			'el': '/translations/el/main.json',
			'ms': '/translations/ms/main.json',
			'pl': '/translations/pl/main.json',
			'uk': '/translations/uk/main.json',
			'it': '/translations/it/main.json',
			'bg': '/translations/bg/main.json',
			'cs': '/translations/cs/main.json',
			'es_419': '/translations/es_419/main.json',
			'es_AR': '/translations/es_AR/main.json',
			'es_CO': '/translations/es_CO/main.json',
			'es_MX': '/translations/es_MX/main.json',
			'hr': '/translations/hr/main.json',
			'id': '/translations/id/main.json',
			'zh_TW': '/translations/zh_TW/main.json',
		},
		dash: {
			'en': '/translations/en/dash.json',
			'en_US': '/translations/en_US/dash.json',
			'en_AU': '/translations/en_AU/dash.json',
			'nl': '/translations/nl/dash.json',
			'ro': '/translations/ro/dash.json',
			'de': '/translations/de/dash.json',
			'es': '/translations/es/dash.json',
			'fr': '/translations/fr/dash.json',
			'ru': '/translations/ru/dash.json',
			'sv': '/translations/sv/dash.json',
			'tr': '/translations/tr/dash.json',
			'pt': '/translations/pt/dash.json',
			'pt_BR': '/translations/pt_BR/dash.json',
			'fi': '/translations/fi/dash.json',
			'nb': '/translations/nb/dash.json',
			'el': '/translations/el/dash.json',
			'ms': '/translations/ms/dash.json',
			'pl': '/translations/pl/dash.json',
			'uk': '/translations/uk/dash.json',
			'it': '/translations/it/dash.json',
			'bg': '/translations/bg/dash.json',
			'cs': '/translations/cs/dash.json',
			'es_419': '/translations/es_419/dash.json',
			'es_AR': '/translations/es_AR/dash.json',
			'es_CO': '/translations/es_CO/dash.json',
			'es_MX': '/translations/es_MX/dash.json',
			'hr': '/translations/hr/dash.json',
			'id': '/translations/id/dash.json',
			'zh_TW': '/translations/zh_TW/dash.json',
		},
	};

	TranslateProvider.addLanguageUrls( languages );
} )
/**
 * angular-ui-router can't handle redirects between states yet.
 * This allows us to set a config on a state to redirect to another one.
 * This is really handy to redirect from a parent to child state.
 * Can remove once they close out: https://github.com/angular-ui/ui-router/issues/27
 */
.run( function( $rootScope, $state )
{
	$rootScope.$on( '$stateChangeStart', function( event, toState )
	{
		var redirect = toState.redirectTo;
		if ( redirect ) {
			event.preventDefault();
			if ( angular.isFunction( redirect ) ) {
				redirect.call( $state );
			}
			else {
				$state.go( redirect );
			}
		}
	} );
} )
// Track time till Angular runs.
.run( function( Analytics )
{
	var ms = Date.now() - window._gjStartTime;
	Analytics.trackTiming( 'shell', 'angular-start', ms );
} )
.name
;

setTimeout( function()
{
	bootstrap( AppModule );
	// angular.bootstrap( document, [ 'App' ] );
}, 0 );