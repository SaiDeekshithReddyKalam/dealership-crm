trigger OpportunityClosedWonStageTrigger on Opportunity (before insert, before update) {
    if (Trigger.isBefore) {
        OpportunityClosedWonStageHandler.validateCloseWonRequirements(Trigger.new);
    }
}