import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RedditSearchComponent } from './reddit-search/reddit-search.component';
import { RedditImageSearchService } from './reddit-search/reddit-image-search.service';

@NgModule({
  declarations: [
    AppComponent,
    RedditSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [RedditImageSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
