import { bootstrapApplication } from '@angular/platform-browser';
import { addEvaIcons } from 'ez-vid-ang';
import { evaAllIcons } from 'ez-vid-ang/icons';
import { App } from './app/app';
import { appConfig } from './app/app.config';

addEvaIcons(evaAllIcons);


bootstrapApplication(App, appConfig)
  .catch((err: any) => console.error(err));
