import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STComponent, STChange, STColumn } from '@delon/abc';
import { RestService } from '@app/service';
import { query, defaultQuery, pages, total, loading, data, selectedRows, selectedRow } from '@app/common';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['../../../common/styles/common.css', './index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnInit {
  query = query;
  pages = pages;
  total = total;
  loading = loading;
  data = data;
  selectedRows = selectedRows;
  selectedRow = selectedRow;
  columns: STColumn[] = [
    { title: '预约人手机号', index: 'socialName' },
    { title: '入园人姓名', index: 'contact' },
    { title: '入园人身份证号', index: 'contactTel' },
    { title: '状态', index: 'address' },
    { title: '预约日期', index: 'area' },
    { title: '核销码', index: 'descr' },
    { title: '核销时间', index: 'gmtCreate' },
  ];

  @ViewChild('st', { static: true })
  st: STComponent;

  StatusList = [
    { label: '全部', value: 'all' },
    { label: '未核销', value: 'ready' },
    { label: '已核销', value: 'finish' },
    { label: '已过期', value: 'expire' },
  ];

  constructor(
    private api: RestService,
    public msg: NzMessageService,
    public modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.query = { ...defaultQuery };
    this.getData();
  }

  getData(pageIndex?: number) {
    this.loading = true;
    this.query.pageNo = pageIndex ? pageIndex : this.query.pageNo;
    // this.api.getSocialProjectList(this.query).subscribe(res => {
    //   this.loading = false;
    //   const { rows, total: totalItem } = res.data || { rows: [], total: 0 };
    //   this.data = rows;
    //   this.total = totalItem;
    //   this.pages = {
    //     ...this.pages,
    //     total: `共 ${totalItem} 条记录`,
    //   };
    //   this.cdr.detectChanges();
    // });
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getData(e.pi);
        break;
      case 'pi':
        this.getData(e.pi);
        break;
      case 'ps':
        this.query.pageSize = e.ps;
        this.getData(e.pi);
        break;
    }
  }

  reset() {
    this.query = { ...defaultQuery };
    this.loading = true;
    setTimeout(() => this.getData(1));
  }
}
