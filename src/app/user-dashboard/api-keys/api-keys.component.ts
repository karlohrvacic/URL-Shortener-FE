import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiKey} from "../../shared/models/ApiKey";
import {filter, Subscription} from "rxjs";
import {ApiKeyService} from "../../shared/services/api-key.service";
import {UrlService} from "../../shared/services/url.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/User";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ClipboardService} from "ngx-clipboard";

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.css']
})
export class ApiKeysComponent implements OnInit {

  displayedColumns: string[] = ['key', 'apiCallsLimit', 'apiCallsUsed', 'createDate', 'expirationDate', 'active', 'action'];
  apiKeysView: MatTableDataSource<ApiKey> = new MatTableDataSource(this.apiKeyService.apiKeys);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  apiKeys!: ApiKey[];
  apiKeyChangeSubscription: Subscription | undefined;
  user!: User | undefined;
  filterValue: string = "";

  constructor(private apiKeyService: ApiKeyService, private urlService: UrlService, private toastr: ToastrService, private authService: AuthService, private clipboardApi: ClipboardService) { }

  ngAfterViewInit(): void {
    this.apiKeysView.sort = this.sort
    this.apiKeysView.paginator = this.paginator
  }

  ngOnInit(): void {
    this.apiKeys = this.apiKeyService.apiKeys;
    this.apiKeyChangeSubscription = this.apiKeyService.apiKeysChange
      .subscribe(apiKeys => {
        this.apiKeys = apiKeys
        this.apiKeysView = new MatTableDataSource(this.apiKeys)
        this.ngAfterViewInit()
        this.applyFilter(this.filterValue)
      });
    this.user = this.authService.user
  }

  ngOnDestroy() {
    this.apiKeyChangeSubscription?.unsubscribe()
  }

  revoke(id: number) {
    this.apiKeyService.revokeApiKey(id);
  }

  createApiKey() {
    this.apiKeyService.generateNewApiKey();
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue.trim().toLowerCase();
    this.apiKeysView.filter = this.filterValue
  }

  copyKey(key: string) {
    this.clipboardApi.copyFromContent(key)
    this.toastr.success("Api key has been copied to clipboard")
  }
}
