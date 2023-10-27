import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  retry,
  startWith,
  switchMap
} from 'rxjs';

import { RedditImageSearchService } from './reddit-image-search.service';
import { ImageMetadata } from './types';

@Component({
  selector: 'app-reddit-search',
  templateUrl: './reddit-search.component.html',
  styleUrls: ['./reddit-search.component.scss']
})
export class RedditSearchComponent {
  subReddits = [
    'aww',
    'wholesomememes',
    'mildlyinteresting',
    'awesome'
  ];
  subReddit = new FormControl(this.subReddits[0], {
    nonNullable: true
  });
  search = new FormControl('', { nonNullable: true });
  results: Observable<ImageMetadata[]>;

  constructor(ris: RedditImageSearchService) {
    const validSubReddit = this.subReddit.valueChanges.pipe(
      startWith(this.subReddit.value)
    );

    const validSearch = this.search.valueChanges.pipe(
      startWith(this.search.value),
      map(search => search.trim()),
      debounceTime(200),
      distinctUntilChanged(),
      filter(search => search !== '')
    );

    this.results = combineLatest([validSubReddit, validSearch]).pipe(
      switchMap(([subReddit, search]) =>
        ris.search(subReddit, search).pipe(
          retry(3),
          // Clear previous entries while waiting
          startWith([])
        )
      )
    );
  }
}
