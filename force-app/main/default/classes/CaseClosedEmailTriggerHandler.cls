public with sharing class CaseClosedEmailTriggerHandler {

    public static void sendemailwhenclosed(Map<Id, Case> oldmap, List<Case> newList) {

        // Map CaseStatus label -> IsClosed
        Map<String, Boolean> isClosedByStatus = new Map<String, Boolean>();
        for (CaseStatus cs : [
            SELECT MasterLabel, IsClosed
            FROM CaseStatus
        ]) {
            isClosedByStatus.put(cs.MasterLabel, cs.IsClosed);
        }

        List<Case> casesJustClosed = new List<Case>();
        Set<Id> ownerIds = new Set<Id>();

        for (Case c : newList) {
            Case oldCase = oldmap.get(c.Id);
            if (oldCase == null) continue;

            // Safe lookup (avoid null pointer if status key not found)
            Boolean wasClosed = isClosedByStatus.containsKey(oldCase.Status) ? isClosedByStatus.get(oldCase.Status) : false;
            Boolean isClosed  = isClosedByStatus.containsKey(c.Status) ? isClosedByStatus.get(c.Status) : false;

            if (wasClosed == false && isClosed == true) {
                casesJustClosed.add(c);
                if (c.OwnerId != null) ownerIds.add(c.OwnerId);
            }
        }

        if (casesJustClosed.isEmpty() || ownerIds.isEmpty()) return;

        Map<Id, User> usersById = new Map<Id, User>([
            SELECT Id, Email
            FROM User
            WHERE Id IN :ownerIds
        ]);

        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();

        for (Case c : casesJustClosed) {
            User owner = usersById.get(c.OwnerId);
            if (owner == null || String.isBlank(owner.Email)) continue;

            // ✅ Use CUSTOM fields per your AC
            String caseEmailSubject = (String.isBlank(c.Subject__c) ? '(No Case Subject)' : c.Subject__c);
            String caseEmailBody    = (String.isBlank(c.Description__c) ? '(No Case Description)' : c.Description__c);

            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[] { owner.Email });
            email.setSubject(caseEmailSubject);
            email.setPlainTextBody(caseEmailBody);

            emails.add(email);
        }

        if (!emails.isEmpty()) {
            Messaging.sendEmail(emails);
        }
    }
}