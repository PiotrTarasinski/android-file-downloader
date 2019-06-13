import { NgZone } from '@angular/core';
import { Component } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import Swal, { SweetAlertType } from 'sweetalert2';
import { ToastController } from '@ionic/angular';

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
  canCancelDownload: boolean;
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
        AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
          .then(() => {
            this.fileName = this.fileUrl.substring(this.fileUrl.lastIndexOf('/') + 1);
            this.progress = 0;
            this.canCancelDownload = true;
            this.fileTransfer.download(this.fileUrl, this.file.externalRootDirectory + this.fileName).then((entry) => {
              console.log('download complete: ' + entry.toURL());
              this.canCancelDownload = false;
              Swal.fire({
                type: 'success',
                title: 'Success',
                text: 'Successfully downloaded file!',
              });
            }, (error) => {
                console.log(error);
                this.canCancelDownload = false;
                let errorType: SweetAlertType = 'error';
                let errorTitle = 'Oops...';
                let errorMsg = 'Something went wrong!';
                if (error.code === 4) {
                  errorType = 'info';
                  errorTitle = 'Canceled';
                  errorMsg = 'File download canceled!';
                } else if (error.code === 3) {
                  errorMsg = 'No Internet connection!';
                } else if (error.code === 2) {
                  errorMsg = 'Invalid file url!';
                }
                Swal.fire({
                  type: errorType,
                  title: errorTitle,
                  text: errorMsg,
                });
            });
            this.fileTransfer.onProgress((data) => {
              this.zone.run(() => {
                this.bytesDownloaded = data.loaded;
                this.progress = data.loaded / data.total;
              });
            });
          });
      }
    });
  }

  cancelDownload = () => {
    this.fileTransfer.abort();
  }


}
