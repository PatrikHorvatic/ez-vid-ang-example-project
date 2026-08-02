import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { TestingPage } from './testing-page/testing-page';
import { SimpleMp4Page } from './simple-mp4-page/simple-mp4-page';
import { AdvancedMp4Page } from './advanced-mp4-page/advanced-mp4-page';
import { SimpleStreamPage } from './simple-stream-page/simple-stream-page';
import { FullStreamPage } from './full-stream-page/full-stream-page';

export const routes: Routes = [
	{
		path: "",
		component: HomePage,
		title: "home"
	},
	{
		path: "simple-mp4",
		component: SimpleMp4Page,
		title: "simple player - mp4"
	},
	{
		path: "advanced-mp4",
		component: AdvancedMp4Page,
		title: "advanced player - mp4"
	},
	{
		path: "simple-stream",
		component: SimpleStreamPage,
		title: "simple player - hls"
	},
	{
		path: "full-stream",
		component: FullStreamPage,
		title: "full player - hls"
	},
	{
		path: "home",
		component: TestingPage,
		title: "testing video"
	}
];
