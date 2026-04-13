import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getReconData from '@salesforce/apex/ReconProgressController.getReconData';
import addLineItem from '@salesforce/apex/ReconProgressController.addLineItem';
import completeWorkOrder from '@salesforce/apex/ReconProgressController.completeWorkOrder';

export default class ReconProgress extends LightningElement {
    @api recordId;
    @track showModal = false;
    @track newType = 'Parts';
    @track newCost = 0;
    @track newNotes = '';
    @track isLoading = true;
    @track hasError = false;

    _wiredResult;
    workOrder;
    lineItems = [];
    totalReconCost = 0;

    columns = [
        { label: 'Type', fieldName: 'Type__c' },
        { label: 'Cost', fieldName: 'Cost__c', type: 'currency' },
        { label: 'Notes', fieldName: 'Notes__c' },
    ];

    typeOptions = [
        { label: 'Parts', value: 'Parts' },
        { label: 'Labor', value: 'Labor' },
        { label: 'Misc', value: 'Misc' },
    ];

    @wire(getReconData, { vehicleId: '$recordId' })
    wiredData(result) {
        this._wiredResult = result;
        this.isLoading = false;
        if (result.data) {
            this.workOrder = result.data.workOrder;
            this.lineItems = result.data.lineItems;
            this.totalReconCost = result.data.totalReconCost;
            this.hasError = false;
        } else if (result.error) {
            this.hasError = true;
        }
    }

    get noWorkOrder() { return !this.isLoading && !this.hasError && !this.workOrder; }
    get hasLineItems() { return this.lineItems && this.lineItems.length > 0; }
    get canComplete() { return this.workOrder && this.workOrder.Status__c !== 'Complete'; }
    get formattedTotalCost() {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.totalReconCost || 0);
    }

    openModal() { this.showModal = true; }
    closeModal() { this.showModal = false; }
    handleTypeChange(e) { this.newType = e.detail.value; }
    handleCostChange(e) { this.newCost = e.detail.value; }
    handleNotesChange(e) { this.newNotes = e.detail.value; }

    handleAddLineItem() {
        addLineItem({
            workOrderId: this.workOrder.Id,
            type: this.newType,
            cost: this.newCost,
            notes: this.newNotes
        }).then(() => {
            this.closeModal();
            this.dispatchEvent(new ShowToastEvent({ title: 'Success', message: 'Line item added.', variant: 'success' }));
            return refreshApex(this._wiredResult);
        }).catch(e => {
            this.dispatchEvent(new ShowToastEvent({ title: 'Error', message: e.body?.message, variant: 'error' }));
        });
    }

    handleComplete() {
        completeWorkOrder({ workOrderId: this.workOrder.Id })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({ title: 'Success', message: 'Work order marked complete. Vehicle status updated to Listed.', variant: 'success' }));
                return refreshApex(this._wiredResult);
            }).catch(e => {
                this.dispatchEvent(new ShowToastEvent({ title: 'Error', message: e.body?.message, variant: 'error' }));
            });
    }
}
