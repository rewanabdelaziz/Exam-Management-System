import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading-service';

@Component({
  selector: 'app-gloabal-loader',
  imports: [],
  templateUrl: './gloabal-loader.html',
  styleUrl: './gloabal-loader.css',
})
export class GloabalLoader {
  isloading;
  
  constructor(private _loading: LoadingService){
    this.isloading = this._loading.isLoading;
  }
}
