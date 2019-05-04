import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TaskModel } from 'src/app/services/task';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { addToPdf, Model } from 'src/app/library/scdk-library';
import { FileService, FileModel } from 'src/app/services/file';
import { tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

export interface DialogData {
  id: string | number;
  result: any;
}

@Component({
  selector: 'app-task-report-dialog',
  templateUrl: './task-report-dialog.component.html',
  styleUrls: ['./task-report-dialog.component.scss']
})
export class TaskReportDialogComponent implements OnInit {
  // public item: TaskModel;
  public item: any;
  public processing: boolean = false;
  public fileListObservable: any;
  public selectedFile: FileModel;
  // public imageList: FileModel[] = [];
  public imageList: any[] = [];
  public checkedFileIds: any[] = [];
  public showImages: boolean = false;
  public showFiles: boolean;
  public showMode: string;
  public showSpecification: boolean;
  public showInputForm: boolean;
  public showOutputForm: boolean;
  // public files: FileModel[];
  public files: any[];


  constructor( public dialogRef: MatDialogRef<TaskReportDialogComponent>,
    public fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: TaskModel) { }


  ngOnInit() {
    this.item = this.data;
    this.fileService.list().subscribe(r => this.files = r);

  }

  generateReport() {
    const pdf = new jsPDF('p', 'px', 'a4');
    this.processing = true;
    addToPdf(pdf, this.item, this.files, this.checkedFileIds)
    .then( (doc: jsPDF) => {
      doc.save('MYPdf.pdf');
      this.processing = false;
    })
    .catch( e => {
      console.log(e);
      this.processing = false;
    });
  }

  onCheckMode(type) {
    this.showMode = 'single_image';
    if (type == 1) {
      this.showMode = 'single_image';
    }else if (type == 2) {
      this.showMode = 'two_image';
    }else if (type == 3) {
      this.showMode = 'three_image';
    }
  }

  onSelectFile(itemId) {
    this.fileService.getExtraData(itemId)
    .subscribe((r: any) => {
        this.selectedFile = r;
    });
  }


  onCheckFiles(file) {
    this.checkedFileIds = [];
    if (file.__checked) {
      file.__checked = false;
    } else {
      file.__checked = true;
    }

    this.checkedFileIds = this.files.filter(f => f['__checked']).map(f => f.id);
    this.pullImageData(this.checkedFileIds);
  }


  pullImageData(fileIds) {
    console.log(fileIds);
    const allResponseObservables = [];
    fileIds.forEach(id => {
        allResponseObservables.push(
          this.fileService.getExtraData(id)
          .pipe(tap((r: FileModel) => {
                    if (!Model.getObject(this.imageList, {id: r.id})) {
                          this.imageList.push(r);
                    }
                })
          ));
    });

    forkJoin(allResponseObservables)
    .subscribe(
      responses => {
        this.imageList = this.imageList.filter(f => this.checkedFileIds.indexOf(f.id) > -1 );
        this.showImages = true;
      },
      error =>  {
          this.showImages = true;
          console.log('pullImageData Error:', error);
    });

  }

}
