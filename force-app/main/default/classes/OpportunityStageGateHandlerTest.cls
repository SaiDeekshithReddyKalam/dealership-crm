@isTest
private class OpportunityStageGateHandlerTest {

    @testSetup
    static void setupData() {
        Account acc = new Account(Name = 'Test Account');
        insert acc;

        Vehicle__c vehicle = new Vehicle__c(
            Name = 'Test Vehicle',
            VIN__c = 'VIN123456789TEST01',
            Status__c = 'Available',
            Acquisition_Date__c = Date.today(),
            Acquisition_Cost__c = 10000
        );
        insert vehicle;
    }

    @isTest
    static void testFinanceSubmitted_ValidRecord() {
        Account acc = [SELECT Id FROM Account LIMIT 1];
        Vehicle__c vehicle = [SELECT Id FROM Vehicle__c LIMIT 1];

        Opportunity opp = new Opportunity(
            Name = 'Valid Finance Deal',
            AccountId = acc.Id,
            CloseDate = Date.today().addDays(30),
            StageName = 'Finance Submitted',
            Vehicle__c = vehicle.Id,
            Deal_Type__c = 'Finance',
            Documents_Verified__c = true
        );

        Test.startTest();
        insert opp;
        Test.stopTest();

        System.assertNotEquals(null, opp.Id, 'Opportunity should be inserted successfully.');
    }

    @isTest
    static void testFinanceSubmitted_MissingVehicle() {
        Account acc = [SELECT Id FROM Account LIMIT 1];

        Opportunity opp = new Opportunity(
            Name = 'Missing Vehicle Deal',
            AccountId = acc.Id,
            CloseDate = Date.today().addDays(30),
            StageName = 'Finance Submitted',
            Deal_Type__c = 'Finance',
            Documents_Verified__c = true
        );

        Test.startTest();
        try {
            insert opp;
            System.assert(false, 'Expected DmlException due to missing Vehicle__c.');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('Vehicle must be populated'),
                'Error message should mention missing vehicle.');
        }
        Test.stopTest();
    }

    @isTest
    static void testFinanceSubmitted_WrongDealType() {
        Account acc = [SELECT Id FROM Account LIMIT 1];
        Vehicle__c vehicle = [SELECT Id FROM Vehicle__c LIMIT 1];

        Opportunity opp = new Opportunity(
            Name = 'Wrong Deal Type Deal',
            AccountId = acc.Id,
            CloseDate = Date.today().addDays(30),
            StageName = 'Finance Submitted',
            Vehicle__c = vehicle.Id,
            Deal_Type__c = 'Cash',
            Documents_Verified__c = true
        );

        Test.startTest();
        try {
            insert opp;
            System.assert(false, 'Expected DmlException due to invalid Deal_Type__c.');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('Deal Type must be Finance'),
                'Error message should mention Deal Type must be Finance.');
        }
        Test.stopTest();
    }

    @isTest
    static void testFinanceSubmitted_DocumentsNotVerified() {
        Account acc = [SELECT Id FROM Account LIMIT 1];
        Vehicle__c vehicle = [SELECT Id FROM Vehicle__c LIMIT 1];

        Opportunity opp = new Opportunity(
            Name = 'Docs Not Verified Deal',
            AccountId = acc.Id,
            CloseDate = Date.today().addDays(30),
            StageName = 'Finance Submitted',
            Vehicle__c = vehicle.Id,
            Deal_Type__c = 'Finance',
            Documents_Verified__c = false
        );

        Test.startTest();
        try {
            insert opp;
            System.assert(false, 'Expected DmlException due to Documents_Verified__c = false.');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('Documents Verified must be checked'),
                'Error message should mention documents verification.');
        }
        Test.stopTest();
    }

    @isTest
    static void testFinanceSubmitted_BulkValidation() {
        Account acc = [SELECT Id FROM Account LIMIT 1];
        Vehicle__c vehicle = [SELECT Id FROM Vehicle__c LIMIT 1];

        List<Opportunity> opps = new List<Opportunity>();

        for (Integer i = 0; i < 200; i++) {
            Opportunity opp = new Opportunity(
                Name = 'Bulk Opp ' + i,
                AccountId = acc.Id,
                CloseDate = Date.today().addDays(30),
                StageName = 'Finance Submitted',
                Vehicle__c = (Math.mod(i, 2) == 0 ? vehicle.Id : null),
                Deal_Type__c = (Math.mod(i, 3) == 0 ? 'Finance' : 'Cash'),
                Documents_Verified__c = (Math.mod(i, 5) == 0)
            );
            opps.add(opp);
        }

        Test.startTest();
        Database.SaveResult[] results = Database.insert(opps, false);
        Test.stopTest();

        Integer failedCount = 0;
        Integer successCount = 0;

        for (Database.SaveResult sr : results) {
            if (sr.isSuccess()) {
                successCount++;
            } else {
                failedCount++;
            }
        }

        System.assert(failedCount > 0, 'Some records should fail validation.');
        System.assert(successCount > 0, 'Some records should pass validation.');
        System.assertEquals(200, results.size(), 'Should process all 200 records.');
    }
}