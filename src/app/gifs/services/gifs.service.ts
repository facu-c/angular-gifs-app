import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];


  private _tagHistory: string[] = [];
  private apiKey: string = 'hOUzVyC9Op7hHXC5CYvYzeMXz7HvPUV1';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }



  get tagsHistory() {
    return [...this._tagHistory];
  }

  private organizeHistory( tag: string ):void {
    tag = tag.toLowerCase();

    if( this._tagHistory.includes(tag) ) {
      this._tagHistory = this._tagHistory.filter( (oldTag) => oldTag !== tag );
    }

  }

  private saveLocalStorage():void {
    localStorage.setItem('history',JSON.stringify(this._tagHistory));
  }

  private loadLocalStorage(): void {
    if( !localStorage.getItem('history') ) return;

    this._tagHistory = JSON.parse(localStorage.getItem('history')!);
    this.searchTag(this._tagHistory[0]);
  }


  public async searchTag(tag: string):Promise<void> {

    if(tag.length === 0) return;

    this.organizeHistory(tag);

    if(this._tagHistory.length > 9) {
      this._tagHistory.pop();
    }
    this._tagHistory.unshift(tag);

    this.saveLocalStorage();

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q',tag);

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe(resp => {
        this.gifList = resp.data;
      })
  }


}
