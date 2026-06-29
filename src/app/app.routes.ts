import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { TestingPage } from './testing-page/testing-page';

export const routes: Routes = [
	{
		path: "",
		component: HomePage,
		title: "home"
	},
	{
		path: "home",
		component: TestingPage,
		title: "testing video"
	}
];
