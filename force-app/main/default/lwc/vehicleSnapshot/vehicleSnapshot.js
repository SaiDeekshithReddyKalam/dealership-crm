import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import VEHICLE_FIELD from '@salesforce/schema/Opportunity.Vehicle__c';

const OPP_FIELDS = [
    'Opportunity.Vehicle__c',
    'Opportunity.Name'
];

const VEHICLE_FIELDS = [
    'Vehicle__c.Id',
    'Vehicle__c.VIN__c',
    'Vehicle__c.Year__c',
    'Vehicle__c.Make__c',
    'Vehicle__c.Model__c',
    'Vehicle__c.Trim__c',
    'Vehicle__c.Status__c',
    'Vehicle__c.List_Price__c',
    'Vehicle__c.Mileage__c',
    'Vehicle__c.Days_On_Lot__c'
];

export default class VehicleSnapshot extends LightningElement {
    @api recordId;
    @track isEditing = false;
    @track newListPrice;
    @track vehicleId;
    @track vehicle;
    @track isLoading = true;
    @track canEdit = true;

    _wiredOpp;
    _wiredVehicle;

    @wire(getRecord, { recordId: '$recordId', fields: OPP_FIELDS })
    wiredOpp(result) {
        this._wiredOpp = result;
        if (result.data) {
            this.vehicleId = getFieldValue(result.data, VEHICLE_FIELD);
            if (!this.vehicleId) this.isLoading = false;
        }
    }

    @wire(getRecord, { recordId: '$vehicleId', fields: VEHICLE_FIELDS })
    wiredVehicle(result) {
        this._wiredVehicle = result;
        if (result.data) {
            this.vehicle = {
                Id: getFieldValue(result.data, 'Vehicle__c.Id'),
                VIN__c: getFieldValue(result.data, 'Vehicle__c.VIN__c'),
                Year__c: getFieldValue(result.data, 'Vehicle__c.Year__c'),
                Make__c: getFieldValue(result.data, 'Vehicle__c.Make__c'),
                Model__c: getFieldValue(result.data, 'Vehicle__c.Model__c'),
                Trim__c: getFieldValue(result.data, 'Vehicle__c.Trim__c'),
                Status__c: getFieldValue(result.data, 'Vehicle__c.Status__c'),
                List_Price__c: getFieldValue(result.data, 'Vehicle__c.List_Price__c'),
                Mileage__c: getFieldValue(result.data, 'Vehicle__c.Mileage__c'),
                Days_On_Lot__c: getFieldValue(result.data, 'Vehicle__c.Days_On_Lot__c'),
            };
            this.newListPrice = this.vehicle.List_Price__c;
            this.isLoading = false;
        } else if (result.error) {
            this.isLoading = false;
        }
    }

    get noVehicle() {
        return !this.isLoading && !this.vehicleId;
    }

    get vehicleLabel() {
        if (!this.vehicle) return '';
        return `${this.vehicle.Year__c} ${this.vehicle.Make__c} ${this.vehicle.Model__c} ${this.vehicle.Trim__c || ''}`.trim();
    }

    get formattedPrice() {
        if (!this.vehicle?.List_Price__c) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.vehicle.List_Price__c);
    }

    get formattedMileage() {
        if (!this.vehicle?.Mileage__c) return 'N/A';
        return new Intl.NumberFormat('en-US').format(this.vehicle.Mileage__c) + ' mi';
    }

    get showAging() {
        return this.vehicle?.Days_On_Lot__c > 45 && this.vehicle?.Status__c !== 'Sold';
    }

    handleEdit() { this.isEditing = true; }
    handleCancel() { this.isEditing = false; }

    handlePriceChange(e) {
        this.newListPrice = e.detail.value;
    }

    handleSave() {
        const fields = {
            Id: this.vehicle.Id,
            List_Price__c: this.newListPrice
        };
        updateRecord({ fields })
            .then(() => {
                this.isEditing = false;
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Vehicle price updated.',
                    variant: 'success'
                }));
                return refreshApex(this._wiredVehicle);
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: error.body?.message || 'Update failed.',
                    variant: 'error'
                }));
            });
    }
}
