import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lt-home-page',
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-page.scss'
})
export class HomePage {

  private router = inject(Router);

  protected goToVideo() {
    this.router.navigate(["/home"])
  }

}
