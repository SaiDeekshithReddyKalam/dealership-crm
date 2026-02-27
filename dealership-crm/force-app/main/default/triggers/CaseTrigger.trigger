trigger CaseTrigger on Case (before insert,before update ) {
    if(Trigger.isBefore){
        if(Trigger.isInsert){
            CaseTriggerHandlers.beforeInsert(Trigger.new);
        }
        else if(Trigger.isUpdate){
            CaseTriggerHandlers.beforeUpdate(Trigger.new, Trigger.oldMap);
        }
    }

}