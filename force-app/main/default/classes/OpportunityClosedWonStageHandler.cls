 public with sharing class OpportunityClosedWonStageHandler {

    public static void validateCloseWonRequirements(List<Opportunity> opportunities) {
        if (opportunities == null || opportunities.isEmpty()) {
            return;
        }

        for (Opportunity opp : opportunities) {
            if (opp.StageName == 'Closed Won') {
                List<String> errors = new List<String>();

                if (opp.Vehicle__c == null) {
                    errors.add('Vehicle must be selected');
                }

                if (opp.Amount == null || opp.Amount <= 0) {
                    errors.add('Amount must be greater than 0');
                }

                if (opp.Deal_Type__c == 'Finance' && opp.Insurance_Verified__c != true) {
                    errors.add('Insurance must be verified for finance deals');
                }

                if (!errors.isEmpty()) {
                    opp.addError('Closed Won requirements not met: ' + String.join(errors, '; '));
                }
            }
        }
    }
}