import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { JwtHelper } from 'angular2-jwt';
import { Http, RequestOptions, Headers } from '@angular/http';

import { OrdersHistoryService } from './orders-history.service';

import { globalVars } from '../../app/globalvariables';
import { PreGenModel } from '../../models/preGen.model';

import { LaundryMap } from '../map/map.component';
import { OrderSummaryPage } from '../order-summary/order-summary';
import { User } from '../../app/user';

import { AuthService } from "../../auth/auth.service";
@Component({
  selector: 'page-orders-history',
  templateUrl: 'orders-history.html',
  providers: [AuthService, User, OrdersHistoryService, NativeStorage, Storage, JwtHelper]
})
export class OrdersHistoryPage{
  
  userID: string;
  response: any;
  preGenData: PreGenModel;
  refreshController : any;
  hideActivityLoader:boolean;
  preGenApiURL: string;
  statusList: Array<Object>;
  currentStatus = "ORI";  //Dummy Code for testing -- Remove it ASAP.


  // user = User;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private ordersHistoryService: OrdersHistoryService,
              private storage: Storage,
              private nativeStorage: NativeStorage,
              private jwtHelper: JwtHelper,
              private user: User,
              private authService: AuthService) {
              // let xAccessToken = this.user.getUserAccessToken();
              
                this.userID = localStorage.getItem('userID');//this.navParams.get('userID');
                 console.log("userID = ",this.userID);
                this.preGenApiURL = globalVars.PreGenApiURL(this.userID);
                this.getOrdersHistory();
  }
  
 
  ionViewDidLoad(){
    this.getOrdersHistory();
    let URL = globalVars.statusAPIURL();
    this.ordersHistoryService.getStatus(URL)
      .subscribe( res => {
        if(res.status == 200){
          console.log(res);
          let response = JSON.parse(res['_body'])["data"];
          this.storage.set("statusList", response);

          //Dummy status list below. Remove it and get stauts from server
          this.statusList = [
            {
              "_id": "58bfbb19685648cd03929946",
              "name": "Order Initiated",
              "code": "ORI"
            },
            {
              "_id": "58bfbb19685648cd03929948",
              "name": "Ready for Pickup from Client",
              "code": "RPC"
            },
            {
              "_id": "58bfbb19685648cd0392994a",
              "name": "Picked Up from Client - On way to vendor",
              "code": "OPC"
            },
            {
              "_id": "58bfbb19685648cd0392994c",
              "name": "Delivered to Vendor",
              "code": "DTV"
            },
            {
              "_id": "58bfbb19685648cd0392994e",
              "name": "Picked Up from Vendor",
              "code": "OPV"
            },
            {
              "_id": "58bfbb19685648cd03929950",
              "name": "Out for Delivery",
              "code": "OFD"
            },
            {
              "_id": "58bfbb19685648cd03929952",
              "name": "Delivered to Client",
              "code": "ODC"
            },
            {
              "_id": "58bfbb19685648cd03929954",
              "name": "Order Amount Paid",
              "code": "OAP"
            },
            {
              "_id": "58bfbb19685648cd03929956",
              "name": "Client Feedback Pending",
              "code": "CFP"
            },
            {
              "_id": "58bfbb19685648cd03929958",
              "name": "Worker Feedback Pending",
              "code": "WFP"
            },
            {
              "_id": "58bfbb19685648cd0392995a",
              "name": "Order Complete",
              "code": "ORC"
            }
          ] ;
          this.statusHtml = this.findStatus(this.currentStatus);
          //Dummy status list above. Remove it and get stauts from server
        }
      })
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getOrdersHistory();
    this.refreshController = refresher;
  }
  getOrdersHistory(){
    console.log("x-access-token = ",localStorage.getItem('x-access-token'),"userID = ",localStorage.getItem('userID'));
    let xAccessToken: any;
        let options, headers: any;
        // let token = this.user.getUserAccessToken();
        // console.log(token);

        let token = localStorage.getItem('x-access-token');
        // this.userID = localStorage.getItem('userID');
        let URL = globalVars.getOrdersHistoryURL(this.userID); 
        console.log(URL);
        console.log(token);
        
        this.authService.getCall(URL)
          .subscribe(res => {
            if(res.status == 200) {
              console.log(res);
              console.log(JSON.parse(res['_body']));
              this.response = JSON.parse(res['_body']);
              // this.hideActivityLoaders();
            }
          },error=>{
            this.hideActivityLoaders();
            console.log("Order history error = ", error);
          },()=>{
            this.hideActivityLoaders();
          })
    // this.hideActivityLoaders();
  }
  hideActivityLoaders(){

      this.hideActivityLoader = true;
      // check if refreshController is'nt undefined
      if(this.refreshController)
      this.refreshController.complete();
}
  placeOrder(){
    this.storage.get("x-access-token")
      .then(
      token => {
        console.log(token);
        
        this.createPreGen(this.preGenApiURL, token);
      }
      )
    
  }

  createPreGen(URL, token) {
    console.log('Create Pre Gen Called');
    console.log(URL);
    
    this.authService.getCall(URL)
      .subscribe(res => {
        if (res.status == 200) {
          let response = JSON.parse(res['_body'])
          // console.log(res['_body']);

          this.preGenData = {
            href: response["href"],
            data: response["data"]
          }
          console.log('Response From PreGen', (this.preGenData.data as any));
          this.navCtrl.push(LaundryMap, {
            preGenData: this.preGenData
          });
        }
      }, err => {
        console.log(JSON.stringify(err));        
      });
  }
  showOrderSummary(orderID){
    this.navCtrl.push(OrderSummaryPage, {
      orderID: orderID,
      navigateFromOrderHistory: true
    })
  }
  statusHtml;
  findStatus(statusCode){
    let self = this;
    // console.log(this.statusList);
    
    return this.statusList.find((x) => {
      if(x["code"] === status){
        console.log(this.statusHtml);
        return this.statusHtml;
      }
    });
  }
}
