import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  fileUrl = 'https://drive.google.com/uc?export=download&id=1ApRtzrFgLgejae8OBmcYfeiJuhpmW_8F';
  fileSize = 'zxczxczxc';
  fileType = 'zxczxczxc';
  bytesDownloaded: number;
  progress: number;

  constructor(
    private http: HttpClient,
  ) {}


  getFileInfo = () => {
    return this.http.get(this.fileUrl)
    .subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {

      }
    );
    console.log(this.fileUrl);
  }

  downloadFile = () => {

  }

}
