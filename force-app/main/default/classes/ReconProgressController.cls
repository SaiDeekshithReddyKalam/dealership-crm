public with sharing class ReconProgressController {

    @AuraEnabled(cacheable=true)
    public static ReconData getReconData(Id vehicleId) {
        ReconData data = new ReconData();

        List<Recon_Work_Order__c> orders = [
            SELECT Id, Status__c, Start_Date__c, End_Date__c, Vendor__c,
                   Total_Recon_Cost__c
            FROM Recon_Work_Order__c
            WHERE Vehicle__c = :vehicleId
            ORDER BY CreatedDate DESC
            LIMIT 1
        ];

        if (!orders.isEmpty()) {
            data.workOrder = orders[0];

            data.lineItems = [
                SELECT Id, Type__c, Cost__c, Notes__c
                FROM Recon_Line_Item__c
                WHERE Work_Order__c = :orders[0].Id
                ORDER BY CreatedDate DESC
                LIMIT 10
            ];
        }

        AggregateResult[] totals = [
            SELECT SUM(Cost__c) totalCost
            FROM Recon_Line_Item__c
            WHERE Work_Order__c IN (
                SELECT Id FROM Recon_Work_Order__c WHERE Vehicle__c = :vehicleId
            )
        ];

        if (!totals.isEmpty() && totals[0].get('totalCost') != null) {
            data.totalReconCost = (Decimal) totals[0].get('totalCost');
        }

        return data;
    }

    @AuraEnabled
    public static void addLineItem(Id workOrderId, String type, Decimal cost, String notes) {
        insert new Recon_Line_Item__c(
            Work_Order__c = workOrderId,
            Type__c = type,
            Cost__c = cost,
            Notes__c = notes
        );
    }

    @AuraEnabled
    public static void completeWorkOrder(Id workOrderId) {
        update new Recon_Work_Order__c(
            Id = workOrderId,
            Status__c = 'Complete',
            End_Date__c = Date.today()
        );
    }

    public class ReconData {
        @AuraEnabled public Recon_Work_Order__c workOrder;
        @AuraEnabled public List<Recon_Line_Item__c> lineItems = new List<Recon_Line_Item__c>();
        @AuraEnabled public Decimal totalReconCost = 0;
    }
}
