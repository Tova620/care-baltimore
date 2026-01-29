import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  collageImages: string[] = [];
  processedImages: string[] = [];
  Math = Math;

  constructor( private readonly _route: Router) {
  }

  ngOnInit() {
    const imageCount = 33;
    const images: string[] = [];

    for (let i = 1; i < imageCount; i++) {
      images.push(`/assets/care-collage/care${i}.jpg`);
    }

    // Save original list if needed
    this.collageImages = images;

    // Adjust image count based on screen size
    this.updateImageCount();

    // Listen for window resize
    window.addEventListener('resize', () => this.updateImageCount());
  }

  updateImageCount() {
    const isMobile = window.innerWidth < 768;
    const totalImagesNeeded = isMobile ? 12 : 30; // Fewer images on mobile
    this.processedImages = this.shuffleWithoutAdjacentDuplicates(this.collageImages, totalImagesNeeded);
  }

  shuffleWithoutAdjacentDuplicates(images: string[], totalNeeded: number): string[] {
    const result: string[] = [];
    const available = [...images];

    for (let i = 0; i < totalNeeded; i++) {
      const lastImage = result[result.length - 1];
      const validChoices = available.filter(img => img !== lastImage);

      if (validChoices.length === 0) {
        available.push(...images.filter(img => img !== lastImage));
        validChoices.push(...available.filter(img => img !== lastImage));
      }

      const randomIndex = Math.floor(Math.random() * validChoices.length);
      const chosen = validChoices[randomIndex];
      result.push(chosen);

      const chosenIndexInAvailable = available.indexOf(chosen);
      if (chosenIndexInAvailable > -1) {
        available.splice(chosenIndexInAvailable, 1);
      }

      if (available.length === 0) {
        available.push(...images.filter(img => img !== chosen));
      }
    }

    return result;
  }

  shuffleArray(arr: string[]): string[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  navigateToVolunteers() {
    this._route.navigate(['/join-our-volunteers']);  // Corrected navigation
  }

  navigateToVisits() {
    this._route.navigate(['/sign-up-for-visits']);
  }
}
