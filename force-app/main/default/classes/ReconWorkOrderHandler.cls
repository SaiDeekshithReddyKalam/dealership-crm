public class ReconWorkOrderHandler {

    private static Boolean isRunning = false;

    public static void onAfterUpdate(List<Recon_Work_Order__c> newList,
                                     Map<Id, Recon_Work_Order__c> oldMap) {
        if (isRunning) return;
        isRunning = true;

        List<Id> vehicleIdsToList   = new List<Id>();
        List<Id> vehicleIdsToRecon  = new List<Id>();

        for (Recon_Work_Order__c wo : newList) {
            Recon_Work_Order__c old = oldMap.get(wo.Id);
            if (old.Status__c != wo.Status__c) {
                if (wo.Status__c == 'Complete') {
                    vehicleIdsToList.add(wo.Vehicle__c);
                    AuditLogService.log('Recon_Work_Order__c', wo.Id,
                        'Recon Complete', old.Status__c, wo.Status__c, 'Info');
                } else if (old.Status__c == 'Complete') {
                    vehicleIdsToRecon.add(wo.Vehicle__c);
                    AuditLogService.log('Recon_Work_Order__c', wo.Id,
                        'Recon Reopened', old.Status__c, wo.Status__c, 'Warning');
                }
            }
        }

        List<Vehicle__c> toUpdate = new List<Vehicle__c>();

        if (!vehicleIdsToList.isEmpty()) {
            for (Vehicle__c v : [SELECT Id, Status__c FROM Vehicle__c
                                  WHERE Id IN :vehicleIdsToList AND Status__c != 'Sold']) {
                toUpdate.add(new Vehicle__c(Id = v.Id, Status__c = 'Listed'));
            }
        }

        if (!vehicleIdsToRecon.isEmpty()) {
            for (Vehicle__c v : [SELECT Id, Status__c FROM Vehicle__c
                                  WHERE Id IN :vehicleIdsToRecon AND Status__c != 'Sold']) {
                toUpdate.add(new Vehicle__c(Id = v.Id, Status__c = 'In Recon'));
            }
        }

        if (!toUpdate.isEmpty()) update toUpdate;

        AuditLogService.commitLogs();
        isRunning = false;
    }
}
