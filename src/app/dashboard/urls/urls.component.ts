import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Url} from "../../shared/models/Url";
import {UrlService} from "../../shared/services/url.service";
import {ToastrService} from "ngx-toastr";
import {ClipboardService} from "ngx-clipboard";
import {environment} from "../../../environments/environment";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Subscription} from "rxjs";
import {RequestPasswordResetComponent} from "../../auth/request-password-reset/request-password-reset.component";
import {MatDialog} from "@angular/material/dialog";
import {EditVisitLimitComponent} from "../edit-visit-limit/edit-visit-limit.component";
import {ConfirmationDialogComponent} from "../../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-urls',
  templateUrl: './urls.component.html',
  styleUrls: ['./urls.component.css']
})
export class UrlsComponent implements AfterViewInit {

  displayedColumns: string[] = ['longUrl', 'shortUrl', 'visits', 'visitLimit', 'createDate', 'lastAccessed', 'active', 'action'];
  urlsView: MatTableDataSource<Url> = new MatTableDataSource(this.urlService.urls);
  urls!: Url[];
  urlsChangeSubscription: Subscription | undefined;
  revokeUrlId: number | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private urlService: UrlService, private toastr: ToastrService, private clipboardApi: ClipboardService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.urls = this.urlService.urls;
    this.urlsChangeSubscription = this.urlService.urlsChange
      .subscribe(urls => {
        this.urls = urls
        this.urlsView = new MatTableDataSource(this.urls)
        this.ngAfterViewInit()
      });
  }

  ngOnDestroy() {
    this.urlsChangeSubscription?.unsubscribe()
  }

  ngAfterViewInit(): void {
    this.urlsView.sort = this.sort
    this.urlsView.paginator = this.paginator
  }

  copyUrl(id: number) {
    // @ts-ignore
    this.clipboardApi.copyFromContent(environment.API_URL + "/" + this.urls.find(url => id == url.id).shortUrl)
    this.toastr.success("Url has been copied to clipboard")
  }

  applyFilter(filterValue: string) {
    this.urlsView.filter = filterValue.trim().toLowerCase();
  }

  editVisitLimit(url: Url) {
      this.dialog.open(EditVisitLimitComponent, {
        width: '30%',
        data: url
      })
  }

  openConfirmationDialog(urlId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.urlService.revokeUrl(urlId);
      }
    });
  }

}
