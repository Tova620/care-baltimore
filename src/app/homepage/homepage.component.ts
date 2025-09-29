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

  constructor( private readonly _route: Router) {
  }

  ngOnInit() {
    const imageCount = 28;
    const images: string[] = [];

    for (let i = 1; i < imageCount; i++) {
      images.push(`/assets/care-collage/care${i}.jpg`);
    }

    // Save original list if needed
    this.collageImages = images;

    // Shuffle while avoiding adjacent duplicates
    const totalImagesNeeded = 30; // or however many you want to display
    this.processedImages = this.shuffleWithoutAdjacentDuplicates(images, totalImagesNeeded);
  }

  shuffleWithoutAdjacentDuplicates(images: string[], totalNeeded: number): string[] {
    let expanded: string[] = [];

    // Repeat images to meet totalNeeded length
    while (expanded.length < totalNeeded) {
      expanded = expanded.concat(images);
    }

    expanded = expanded.slice(0, totalNeeded); // trim if over

    const maxAttempts = 10;
    let attempt = 0;

    const hasAdjacentDuplicates = (arr: string[]) =>
      arr.some((img, i) => i > 0 && img === arr[i - 1]);

    do {
      expanded = this.shuffleArray([...expanded]);
      attempt++;
    } while (hasAdjacentDuplicates(expanded) && attempt < maxAttempts);

    return expanded;
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
