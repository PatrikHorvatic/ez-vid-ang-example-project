import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lt-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
  :host {
    display: block;
    width: 100vw;
    height: 100vh;
    position: relative;
  }
  `,
})
export class App {
  protected readonly title = signal('Eva library testing');
}
