import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STComponent, STChange, STColumn } from '@delon/abc';
import { RestService } from '@app/service';
import { query, defaultQuery, pages, total, loading, data, selectedRows, selectedRow } from '@app/common';
import dayjs from 'dayjs/esm';
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
    { title: '预约人手机号', index: 'tel' },
    { title: '入园人姓名', index: 'name' },
    { title: '入园人身份证号', index: 'idCard' },
    {
      title: '状态',
      index: 'status',
      type: 'badge',
      badge: {
        1: { text: '可用', color: 'success' },
        2: { text: '已核销', color: 'default' },
        3: { text: '已过期', color: 'error' },
      },
    },
    { title: '提交时间', index: 'submitTime', type: 'date' },
    { title: '预约日期', index: 'appointDate' },
    { title: '核销码', index: 'code' },
    { title: '核销时间', index: 'checkoutTime' },
  ];

  stat = {} as any;

  @ViewChild('st', { static: true })
  st: STComponent;

  StatusList = [
    { label: '可用', value: 1 },
    { label: '已核销', value: 2 },
    { label: '已过期', value: 3 },
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
    this.getSubscribeInfo();
  }

  getSubscribeInfo() {
    this.api.getSubscribeInfo({}).subscribe(res => {
      if (res.code === '0') {
        this.stat = res.data;
      } else {
        this.msg.error('统计信息获取失败');
      }
      this.cdr.detectChanges();
    });
  }

  getData(pageIndex?: number) {
    this.loading = true;
    this.query.pageNo = pageIndex ? pageIndex : this.query.pageNo;
    if (this.query.startAppoint) {
      this.query.startAppoint = dayjs(this.query.startAppoint).format('YYYY-MM-DD');
    }
    if (this.query.endAppoint) {
      this.query.endAppoint = dayjs(this.query.endAppoint).format('YYYY-MM-DD');
    }
    this.api.getSubscribeList(this.query).subscribe(res => {
      this.loading = false;
      const { rows, total: totalItem } = res.data || { rows: [], total: 0 };
      this.data = rows;
      this.total = totalItem;
      this.pages = {
        ...this.pages,
        total: `共 ${totalItem} 条记录`,
      };
      this.cdr.detectChanges();
    });
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
