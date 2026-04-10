trigger OpportunityStageGateTrigger on Opportunity (before insert, before update) {
    if (Trigger.isBefore) {
        OpportunityStageGateHandler.validateFinanceSubmitted(Trigger.new);
    }
}