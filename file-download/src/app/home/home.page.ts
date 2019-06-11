import { Component } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { NgZone } from '@angular/core';

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
  fileName: string;
  public fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    private http: HTTP,
    public toastController: ToastController,
    private transfer: FileTransfer,
    private file: File,
    private zone: NgZone,
  ) {}


  getFileInfo = (showToast: boolean) => {
    this.http.head(this.fileUrl, {}, {})
      .then(async (data) => {
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
    Swal.fire({
      title: 'Warning',
      text: 'Are you sure you wanna download this file?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Download'
    }).then((result) => {
      if (result.value) {
        this.getFileInfo(false);
        this.fileName = this.fileUrl.substring(this.fileUrl.lastIndexOf('/') + 1);
        this.progress = 0;
        this.fileTransfer.download(this.fileUrl, this.file.dataDirectory + this.fileName).then((entry) => {
          console.log('download complete: ' + entry.toURL());
          Swal.fire({
            type: 'success',
            title: 'Success',
            text: 'Successfully downloaded file!',
          });
        }, (error) => {
            console.log(error);
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
        });
        this.fileTransfer.onProgress((data) => {
          this.zone.run(() => {
            this.bytesDownloaded = data.loaded;
            this.progress = data.loaded / data.total;
            console.log(this.progress);
          });
        });
      }
    });
  }


}
