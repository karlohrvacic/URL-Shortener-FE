import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ApiKeyService} from "../../shared/services/api-key.service";
import { Location } from '@angular/common'
import {ApiKey} from "../../shared/models/ApiKey";
import {Url} from "../../shared/models/Url";
import {UrlService} from "../../shared/services/url.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {environment} from "../../../environments/environment";
import {ToastrService} from "ngx-toastr";
import {ClipboardService} from "ngx-clipboard";

@Component({
  selector: 'app-api-key-details',
  templateUrl: './api-key-details.component.html',
  styleUrls: ['./api-key-details.component.css']
})
export class ApiKeyDetailsComponent implements OnInit {

  displayedColumns: string[] = ['longUrl', 'shortUrl', 'visits', 'visitLimit', 'createDate', 'lastAccessed', 'active', 'action'];
  urlsView: MatTableDataSource<Url> = new MatTableDataSource(this.urlService.urls.filter(u => u.apiKey.id == this.apiKeyId));

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  subscription: Subscription = null!;
  urls!: Url[];
  urlChangeSubscription: Subscription | undefined;  apiKeyId!: Number;
  apiKey!: ApiKey;

  constructor(private route: ActivatedRoute, private router: Router, private apiKeyService: ApiKeyService, private location: Location, private urlService: UrlService,
              private toastr: ToastrService, private clipboardApi: ClipboardService) { }

  ngAfterViewInit(): void {
    this.urlsView.sort = this.sort
    this.urlsView.paginator = this.paginator
  }

  ngOnInit(): void {
    this.apiKeyId = this.route.snapshot.params['id'];
    this.subscription = this.route.params.subscribe(
      (params: Params) => {
        this.apiKeyId = params['id'];
      });

    // @ts-ignore
    this.apiKey = this.apiKeyService.apiKeys.find(a => a.id == this.apiKeyId);
    this.urls = this.urlService.urls.filter(u => u.apiKey.id == this.apiKeyId);

    this.urlChangeSubscription = this.urlService.urlsChange
      .subscribe(urls => {
        this.urls = urls.filter(u => u.apiKey.id == this.apiKeyId)
        this.urlsView = new MatTableDataSource(this.urls);
        this.ngAfterViewInit();
      });
  }

  back(){
    this.location.back();
  }

  revoke() {
    this.apiKeyService.revokeApiKey(this.apiKeyId);
  }

  revokeUrl(id: Number) {
    this.urlService.revokeUrl(id);
  }

  applyFilter(filterValue: string) {
    this.urlsView.filter = filterValue.trim().toLowerCase();
  }

  copyUrl(id: Number) {
    // @ts-ignore
    this.clipboardApi.copyFromContent(environment.API_URL + "/" + this.urls.find(url => id == url.id).shortUrl)
    this.toastr.success("Url has been copied to clipboard")
  }

}
