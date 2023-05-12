import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { flatMap } from 'lodash-es';
import { Observable, map } from 'rxjs';

export interface RedditResult {
  thumbnail: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class RedditImageSearchService {
  constructor(private http: HttpClient) {}

  search(
    subReddit: string,
    search: string
  ): Observable<RedditResult[]> {
    const url = `https://www.reddit.com/r/${subReddit}/search.json`;
    const params = { restrict_sr: 'on', q: search };
    return this.http
      .get<any[]>(url, { params })
      .pipe(map(translateRedditResults));
  }
}

function translateRedditResults(items: any): RedditResult[] {
  // This function doesn't know anything about HTTP or Observable; it just
  // manages the messy shape of this API's data return layout.

  return flatMap(
    items.data.children,
    (item: {
      data?: {
        thumbnail: string;
        title: string;
      };
    }): RedditResult[] => {
      if (item) {
        const itemData = item.data;
        if (itemData) {
          const thumbnail = itemData.thumbnail;
          const title = itemData.title;
          if (thumbnail.startsWith('http')) {
            return [{ thumbnail, title }];
          }
        }
      }
      return [];
    }
  );
}
