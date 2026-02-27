@IsTest
private class CaseClosedEmailHandlerTest {

    private static String getAnyOpenStatus() {
        return [
            SELECT MasterLabel
            FROM CaseStatus
            WHERE IsClosed = false
            ORDER BY SortOrder
            LIMIT 1
        ].MasterLabel;
    }

    private static String getAnyClosedStatus() {
        return [
            SELECT MasterLabel
            FROM CaseStatus
            WHERE IsClosed = true
            ORDER BY SortOrder
            LIMIT 1
        ].MasterLabel;
    }

    private static User createTestUser(String prefix) {
        Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        User u = new User(
            ProfileId = p.Id,
            Username = prefix + System.currentTimeMillis() + '@test.com',
            Email = prefix + '@test.com',
            LastName = 'Owner',
            Alias = prefix.substring(0, Math.min(8, prefix.length())),
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US'
        );
        insert u;
        return u;
    }

    @IsTest
    static void caseMovesToClosed_sendsEmail() {
        User u = createTestUser('owner');

        Case c = new Case(
            OwnerId = u.Id,
            Subject__c = 'Custom Subject',
            Description__c = 'Custom Description',
            Status = getAnyOpenStatus(),
            Origin = 'Phone'
        );
        insert c;

        Test.startTest();
        Integer beforeInv = Limits.getEmailInvocations();

        c.Status = getAnyClosedStatus();
        update c;

        Integer afterInv = Limits.getEmailInvocations();
        Test.stopTest();

        System.assertEquals(beforeInv + 1, afterInv, 'Email should be sent when case moves to closed.');
    }

    @IsTest
    static void caseNotMovedToClosed_doesNotSendEmail() {
        User u = createTestUser('owner2');

        Case c = new Case(
            OwnerId = u.Id,
            Subject__c = 'Open Case',
            Description__c = 'Still open',
            Status = getAnyOpenStatus(),
            Origin = 'Phone'
        );
        insert c;

        Test.startTest();
        Integer beforeInv = Limits.getEmailInvocations();

        // Not closing the case
        c.Subject__c = 'Updated Subject';
        update c;

        Integer afterInv = Limits.getEmailInvocations();
        Test.stopTest();

        System.assertEquals(beforeInv, afterInv, 'Email should NOT be sent if case is not moved to closed.');
    }
}