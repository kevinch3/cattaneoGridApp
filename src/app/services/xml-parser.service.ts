import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class XmlParserService {
  constructor(
    private http: HttpClient
  ) {}

  fetchXml(url: string): Promise<any> {
    return this.http.get(url, { responseType: 'text' }).toPromise();
  }

  parse(xmlString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlString, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}