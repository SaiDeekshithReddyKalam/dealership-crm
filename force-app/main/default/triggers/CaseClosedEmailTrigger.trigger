trigger CaseClosedEmailTrigger on Case (after update) {

    if (Trigger.isAfter && Trigger.isUpdate) {

        CaseClosedEmailTriggerHandler.sendemailwhenclosed(
            Trigger.oldMap,
            Trigger.new
        );
    }
}