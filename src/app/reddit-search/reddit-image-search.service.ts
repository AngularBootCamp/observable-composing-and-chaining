import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { flatMap } from 'lodash';

@Injectable()
export class RedditImageSearchService {
  constructor(private http: HttpClient) { }

  search(subReddit: string, search: string): Observable<string[]> {
    const url = 'https://www.reddit.com/r/' +
      subReddit +
      '/search.json?restrict_sr=on&q=' + search;
    return this.http.get(url)
      .pipe(map(translateRedditResults));
  }
}

function translateRedditResults(items: any) {
  // This function doesn't know anything about HTTP or Observable; it just
  // manages the messy shape of this API's data return layout.

  return flatMap(items.data.children,
    ((item: {}): string[] => {
      if (item) {
        const data = item['data'];
        if (data) {
          const thumbnail = data['thumbnail'];
          if (thumbnail.startsWith('http')) {
            return [thumbnail];
          }
        }
      }
      return [];
    }));
}
