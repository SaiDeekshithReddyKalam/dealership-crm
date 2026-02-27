public with sharing class CaseTriggerHandlers {
   private static final string working_status = 'Working';
   public static  void beforeInsert(List<Case> newCases) {
        for(Case c : newCases){
            if(c.Status == working_status && c.date_work_started__c == null){
                c.date_work_started__c = System.now();
            }
        }
    }
    public static void beforeUpdate(List<Case> newCases, Map<Id, Case> oldMap) {
        for(Case c : newCases){
            Case oldCase = oldMap.get(c.Id);
            Boolean movedToWorking = oldCase.Status != working_status && c.Status == working_status;
            if(movedToWorking ){
                c.date_work_started__c = System.now();
        }

    }
}
}