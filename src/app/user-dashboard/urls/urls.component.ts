import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Url} from "../../shared/models/Url";
import {UrlService} from "../../shared/services/url.service";
import {ToastrService} from "ngx-toastr";
import {ClipboardService} from "ngx-clipboard";
import {environment} from "../../../environments/environment";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {interval, Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {EditVisitLimitComponent} from "../edit-visit-limit/edit-visit-limit.component";
import {ConfirmationDialogComponent} from "../../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-urls',
  templateUrl: './urls.component.html',
  styleUrls: ['./urls.component.css']
})
export class UrlsComponent implements AfterViewInit {

  displayedColumns: string[] = ['longUrl', 'shortUrl', 'visits', 'visitLimit', 'createDate', 'lastAccessed', 'expirationDate', 'active', 'action'];
  urlsView: MatTableDataSource<Url> = new MatTableDataSource(this.urlService.urls);
  urls!: Url[];
  urlsChangeSubscription: Subscription | undefined;
  updateUrlSubscription: Subscription | undefined;
  revokeUrlId: number | null = null;
  filterValue: string = "";
  refreshedAtDate: Date = new Date();
  refreshRate: number = 20;

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
        this.applyFilter(this.filterValue)
        this.refreshedAtDate = new Date()
      });

    this.subscribeUrl()
  }

  subscribeUrl() {
    this.updateUrlSubscription?.unsubscribe();

    if (this.refreshRate < 5) {
      this.refreshRate = 5;
    }

    this.updateUrlSubscription = interval(1000 * this.refreshRate).subscribe(
      () => { this.urlService.getMyUrls() });
  }

  ngOnDestroy() {
    this.urlsChangeSubscription?.unsubscribe()
    this.updateUrlSubscription?.unsubscribe()
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
    this.filterValue = filterValue.trim().toLowerCase();
    this.urlsView.filter = this.filterValue
  }

  editVisitLimit(url: Url) {
      this.dialog.open(EditVisitLimitComponent, {
        data: url
      })
  }

  openConfirmationDialog(urlId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.urlService.revokeUrl(urlId);
      }
    });
  }

  openDeleteUrlConfirmation(urlId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.urlService.deleteUrl(urlId);
      }
    });
  }

}
