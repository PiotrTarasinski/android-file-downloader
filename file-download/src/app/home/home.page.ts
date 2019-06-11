import { Component } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  fileUrl = 'http://ipv4.download.thinkbroadband.com/20MB.zip';
  fileSize: number;
  fileType = '';
  bytesDownloaded: number;
  progress: number;

  constructor(
    private http: HTTP,
    public toastController: ToastController
  ) {}


  getFileInfo = (showToast: boolean) => {
    this.http.head(this.fileUrl, {}, {})
      .then(async (data) => {
        // this.fileSize = (data.headers['content-length'] * Math.pow(10, -6)).toFixed(2).toString() + ' Mb';
        this.fileSize = data.headers['content-length'];
        this.fileType = data.headers['content-type'];
        if (showToast) {
          const toast = await this.toastController.create({
            message: 'Downloaded file info successfully',
            duration: 2000
          });
          toast.present();
        }
      })
      .catch(error => {
        console.log(error);
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      });
  }

  downloadFile = () => {
    this.getFileInfo(false);
  }

}
