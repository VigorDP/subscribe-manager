import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './index/index.component';

const COMPONENTS = [ProjectComponent];

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: ProjectComponent, data: { title: '预约管理' } },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [...COMPONENTS],
  exports: [RouterModule],
})
export class RecordModule {}
