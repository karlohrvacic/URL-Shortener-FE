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

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private urlService: UrlService, private toastr: ToastrService, private clipboardApi: ClipboardService) {}

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

  revokeUrl(id: Number) {
    this.urlService.revokeUrl(id);
  }

  copyUrl(id: Number) {
    // @ts-ignore
    this.clipboardApi.copyFromContent(environment.API_URL + "/" + this.urls.find(url => id == url.id).shortUrl)
    this.toastr.success("Url has been copied to clipboard")
  }

  applyFilter(filterValue: string) {
    this.urlsView.filter = filterValue.trim().toLowerCase();
  }

}
