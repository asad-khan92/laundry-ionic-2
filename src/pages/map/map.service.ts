import {Injectable} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { Storage } from '@ionic/storage';
@Injectable()

export class MapService{
    headers: Headers;
    options: RequestOptions;
    constructor(private http: Http, private storage: Storage){
        this.headers = new Headers({
                    'x-access-token': this.storage.get('authToken')
            });
            this.options = new RequestOptions({
                    headers: this.headers
            });
    }
    myApiKey = 'AIzaSyBifb4pycCZZCs1OqewdQ-d698bylvYjkw'
    
    getJSON = (place: string) => {
        let stringQuery: string; //= place +  " in UAE";
        place == undefined || place == '' ? stringQuery = '' : stringQuery = place +  "\%20in\%20in UAE";
        let googleLocationApi = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${stringQuery}&key=${this.myApiKey}`
        console.log(googleLocationApi);

        return this.http.get(googleLocationApi)
            .map(res => JSON.parse(res['_body']).results)
            // .map(e=> e.formatted_address)
     } 


    patchAddress = (URL: string, data: any, token?:any) =>{
        let headers = new Headers({'x-access-token': token});
        let options = new RequestOptions({ headers: headers });
        console.log("Hitting", URL);
        return this.http.patch(URL, data, options);
    }
    
    getAddress = (URL) => {
        console.log("Hitting", URL);
        return this.http.get(URL);
    }

    
}