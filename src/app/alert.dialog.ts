import { Injectable,Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

/**
 * Author: Muhammad Shahab
 * Date: 13 Apr 2017
 * Description: It creates different types of dialog
 */
@Injectable()
export class AlertDialogFactory {
    constructor(private alertCtrl: AlertController) {

    }

    openAlertDialog(title: string, msg: string) {
        let alert = this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: ['Ok'],
            inputs: [{
                name: 'Additional Information',
                placeholder: 'Press Enter to submit',
                type: 'textarea'
            }],
        });
        alert.present();
    }
    selected:any;
    checkBoxAlertDialog(title: string, inputs){
        let alert = this.alertCtrl.create({
            title: title,
        });

        inputs.forEach(input => {
            alert.addInput({
                type: 'checkbox',
                label: input.alias,
                value: input,
                checked: false
            });
        });
        alert.addButton('Cancel');
        alert.addButton({
            text: 'Okay',
            handler: data => {
                console.log('Checkbox data:', data);
                // this.testCheckboxOpen = false;
                // this.testCheckboxResult = data;
            }
        });
        alert.present();
        alert.onDidDismiss((data) => {
            return data;
        });

    }

}