import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UrlService} from "../../shared/services/url.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Url} from "../../shared/models/Url";

@Component({
  selector: 'app-edit-visit-limit',
  templateUrl: './edit-visit-limit.component.html',
  styleUrls: ['./edit-visit-limit.component.css']
})
export class EditVisitLimitComponent implements OnInit {

  editVisitLimitForm!: FormGroup;
  url!: Url;

  constructor(private urlService: UrlService, public dialogRef: MatDialogRef<EditVisitLimitComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.url = this.data
    this.editVisitLimitForm = new FormGroup({
      'visits': new FormControl(this.url.visitLimit, [Validators.required, Validators.min(this.url.visits)]),
    });
  }

  onSend() {
    this.url.visitLimit = this.editVisitLimitForm.value['visits']
    this.urlService.changeUrlVisitLimit({ id: this.url.id, visitLimit: this.url.visitLimit });
  }

}
