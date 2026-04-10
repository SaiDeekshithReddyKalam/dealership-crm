public class OpportunityStageGateHandler {

    public static void validateFinanceSubmitted(List<Opportunity> oppList) {
        if (oppList == null || oppList.isEmpty()) {
            return;
        }

        for (Opportunity opp : oppList) {

            if (opp.StageName == 'Finance Submitted') {

                if (opp.Vehicle__c == null) {
                    opp.addError(Opportunity.Vehicle__c, 'Vehicle must be populated before moving to Finance Submitted.');
                }

                if (opp.Deal_Type__c == null || opp.Deal_Type__c != 'Finance') {
                    opp.addError(Opportunity.Deal_Type__c, 'Deal Type must be Finance before moving to Finance Submitted.');
                }

                if (opp.Documents_Verified__c != true) {
                    opp.addError(Opportunity.Documents_Verified__c, 'Documents Verified must be checked before moving to Finance Submitted.');
                }
            }
        }
    }
}
