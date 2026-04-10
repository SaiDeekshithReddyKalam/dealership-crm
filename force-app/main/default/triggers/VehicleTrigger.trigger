trigger VehicleTrigger on Vehicle__c (before update, after update) {
    if (Trigger.isBefore && Trigger.isUpdate) {
        VehicleTriggerHandler.onBeforeUpdate(Trigger.new, Trigger.oldMap);
    }
    if (Trigger.isAfter && Trigger.isUpdate) {
        VehicleTriggerHandler.onAfterUpdate(Trigger.new, Trigger.oldMap);
    }
}
