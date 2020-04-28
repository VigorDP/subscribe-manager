/*
 * @Description:
 * @Date: 2019-10-18 14:29:07
 * @LastEditors: FYC
 * @Author: FYC
 * @LastEditTime: 2019-10-19 15:34:57
 */
import { _HttpClient, SettingsService } from '@delon/theme';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { RestService } from '@app/service';
import { config } from '@shared';
import { PUBLICKEY } from '@app/common';
import { LazyService } from '@delon/util';
@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class UserLoginComponent implements OnInit {
  constructor(
    fb: FormBuilder,
    modalSrv: NzModalService,
    public settingSrv: SettingsService,
    public http: _HttpClient,
    public msg: NzMessageService,
    public router: Router,
    private api: RestService,
    private lazy: LazyService,
    @Inject(DA_SERVICE_TOKEN) public tokenService: ITokenService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, Validators.required],
    });
    modalSrv.closeAll();
    lazy.load([`/assets/js/jsencrypt.min.js`]).then(() => {
      this.encryptReady = true;
    });
  }
  encryptReady = false; // 加密套件是否加载成功

  // #region fields

  get userName() {
    return this.form.controls.userName;
  }

  get password() {
    return this.form.controls.password;
  }

  get mobile() {
    return this.form.controls.mobile;
  }

  get captcha() {
    return this.form.controls.captcha;
  }

  form: FormGroup;
  error = '';
  type = 0;

  // #region get captcha

  count = 0;
  interval$: any;

  ngOnInit() {}

  // #endregion

  switch(ret: any) {
    this.type = ret.index;
  }

  getCaptcha() {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  // #endregion

  submit() {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
    }
    if (this.encryptReady) {
      if (this.userName.value === 'admin' && this.password.value === 'fdjt123') {
        this.tokenService.set({ token: 'hmf' });
        this.router.navigateByUrl('record', { replaceUrl: true });
      } else {
        this.msg.error('账号或密码不对');
      }
    } else {
      this.msg.error('加密套件加载失败，请刷新重试');
    }
  }

  // #endregion
}
