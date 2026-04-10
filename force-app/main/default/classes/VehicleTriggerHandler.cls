public class VehicleTriggerHandler {

    public static void onBeforeUpdate(List<Vehicle__c> newList, Map<Id, Vehicle__c> oldMap) {
        for (Vehicle__c v : newList) {
            Vehicle__c old = oldMap.get(v.Id);
            if (old.Status__c != v.Status__c) {
                v.Previous_Status__c = old.Status__c;
            }
        }
    }

    public static void onAfterUpdate(List<Vehicle__c> newList, Map<Id, Vehicle__c> oldMap) {
        for (Vehicle__c v : newList) {
            Vehicle__c old = oldMap.get(v.Id);
            if (old.Status__c != v.Status__c) {
                AuditLogService.log('Vehicle__c', v.Id, 'Status Changed',
                    old.Status__c, v.Status__c, 'Info');
            }
        }
        AuditLogService.commitLogs();
    }
public static void preventOpportunityOnSoldVehicle(List<Opportunity> newList) {
        Set<Id> vehicleIds = new Set<Id>();
        for (Opportunity o : newList) {
            if (o.Vehicle__c != null) vehicleIds.add(o.Vehicle__c);
        }
        if (vehicleIds.isEmpty()) return;

        Map<Id, Vehicle__c> vehicles = new Map<Id, Vehicle__c>(
            [SELECT Id, Status__c FROM Vehicle__c WHERE Id IN :vehicleIds]
        );

        for (Opportunity o : newList) {
            if (o.Vehicle__c != null) {
                Vehicle__c v = vehicles.get(o.Vehicle__c);
                if (v != null && v.Status__c == 'Sold') {
                    o.addError('Cannot link Opportunity to a Sold vehicle. Please select an available vehicle.');
                }
            }
        }
    }
}
