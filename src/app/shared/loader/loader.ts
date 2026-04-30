import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../../core/services/loader-service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  isVisible = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading.subscribe((value) => {
      this.isVisible = value;
    });
  }
}
