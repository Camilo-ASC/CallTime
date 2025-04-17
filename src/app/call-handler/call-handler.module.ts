import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallHandlerPageRoutingModule } from './call-handler-routing.module';

import { CallHandlerPage } from './call-handler.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallHandlerPageRoutingModule
  ],
  declarations: [CallHandlerPage]
})
export class CallHandlerPageModule {}
