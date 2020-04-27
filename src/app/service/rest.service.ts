import { _HttpClient, SettingsService } from '@delon/theme';
import { Injectable } from '@angular/core';

const PREFIX = '/hl/social/';

@Injectable({ providedIn: 'root' })
export class RestService {
  constructor(private http: _HttpClient, private settings: SettingsService) {}

  // 预约管理-获取列表
  getSubscribeList = (params: any) => this.http.post(`${PREFIX}social/list`, params);
}

function paramsWithExtraParams(params, community) {
  if (community) {
    return { ...params, socialId: community.id, socialIdNeeded: true };
  } else {
    return params;
  }
}
