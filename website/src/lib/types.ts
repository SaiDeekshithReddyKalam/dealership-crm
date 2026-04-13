export interface Vehicle {
  Id: string;
  Name: string;
  VIN__c: string;
  Year__c: number;
  Make__c: string;
  Model__c: string;
  Trim__c: string;
  Mileage__c: number;
  List_Price__c: number;
  Status__c: string;
  Days_On_Lot__c: number;
  Lot_Location__c: string;
  Acquisition_Date__c: string;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  vehicleId: string;
  vehicleName: string;
  type: string;
}
