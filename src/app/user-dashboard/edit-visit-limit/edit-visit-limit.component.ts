import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UrlService} from "../../shared/services/url.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Url} from "../../shared/models/Url";

@Component({
  selector: 'app-edit-visit-limit',
  templateUrl: './edit-visit-limit.component.html',
  styleUrls: ['./edit-visit-limit.component.css']
})
export class EditVisitLimitComponent implements OnInit {

  editVisitLimitForm!: UntypedFormGroup;
  url!: Url;
  dateNow: Date = new Date();

  constructor(private urlService: UrlService, public dialogRef: MatDialogRef<EditVisitLimitComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.url = this.data
    this.editVisitLimitForm = new UntypedFormGroup({
      'visits': new UntypedFormControl(this.url.visitLimit, [Validators.required, Validators.min(0)]),
      'expirationDate': new UntypedFormControl(this.url.expirationDate)
    });
  }

  onSend() {
    this.url.visitLimit = this.editVisitLimitForm.value['visits']
    this.url.expirationDate = this.editVisitLimitForm.value['expirationDate']
    this.urlService.changeUrlVisitLimit({ id: this.url.id, visitLimit: this.url.visitLimit, expirationDate: this.url.expirationDate });
  }

}
