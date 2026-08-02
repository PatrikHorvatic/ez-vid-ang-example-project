import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'lt-home-page',
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-page.scss',
  imports: [RouterLink],
})
export class HomePage {

  private router = inject(Router);

  protected goToVideo() {
    this.router.navigate(["/home"])
  }

}
