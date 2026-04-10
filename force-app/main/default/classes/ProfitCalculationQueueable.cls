public class ProfitCalculationQueueable implements Queueable {
    private List<Id> vehicleIds;

    public ProfitCalculationQueueable(List<Id> vehicleIds) {
        this.vehicleIds = vehicleIds;
    }

    public void execute(QueueableContext ctx) {
        // Aggregate recon line item costs per vehicle via work orders
        Map<Id, Decimal> reconCostByVehicle = new Map<Id, Decimal>();
        for (AggregateResult ar : [
            SELECT Work_Order__r.Vehicle__c vehicleId, SUM(Cost__c) totalCost
            FROM Recon_Line_Item__c
            WHERE Work_Order__r.Vehicle__c IN :vehicleIds
            GROUP BY Work_Order__r.Vehicle__c
        ]) {
            reconCostByVehicle.put((Id) ar.get('vehicleId'), (Decimal) ar.get('totalCost'));
        }

        List<Vehicle__c> vehicles = [
            SELECT Id, Acquisition_Cost__c, Sale_Price__c
            FROM Vehicle__c
            WHERE Id IN :vehicleIds
        ];

        List<Vehicle__c> toUpdate = new List<Vehicle__c>();
        for (Vehicle__c v : vehicles) {
            Decimal reconTotal = reconCostByVehicle.containsKey(v.Id) ? reconCostByVehicle.get(v.Id) : 0;
            Decimal totalCost  = (v.Acquisition_Cost__c != null ? v.Acquisition_Cost__c : 0) + reconTotal;
            Decimal profit     = (v.Sale_Price__c != null ? v.Sale_Price__c : 0) - totalCost;
            toUpdate.add(new Vehicle__c(Id = v.Id, Gross_Profit__c = profit));
        }

        if (!toUpdate.isEmpty()) update toUpdate;
    }
}
