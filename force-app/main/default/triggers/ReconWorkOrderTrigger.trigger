trigger ReconWorkOrderTrigger on Recon_Work_Order__c (after update) {
    ReconWorkOrderHandler.onAfterUpdate(Trigger.new, Trigger.oldMap);
}
