@isTest
private class OpportunityClosedWonStageHandlerTest {

    @testSetup
    static void setupData() {
        Vehicle__c vehicle = new Vehicle__c(
            Name = 'Test Vehicle',
            VIN__c = '1HGCM82633A123456',
            Status__c = 'In Stock',
            Acquisition_Date__c = Date.today(),
            Acquisition_Cost__c = 10000
        );
        insert vehicle;
    }

    private static Id getVehicleId() {
        return [SELECT Id FROM Vehicle__c LIMIT 1].Id;
    }

    @isTest
    static void testClosedWonValidCashDeal() {
        Opportunity opp = new Opportunity(
            Name = 'Valid Cash Deal',
            StageName = 'Closed Won',
            CloseDate = Date.today(),
            Amount = 15000,
            Vehicle__c = getVehicleId(),
            Deal_Type__c = 'Cash',
            Insurance_Verified__c = false
        );

        Test.startTest();
        insert opp;
        Test.stopTest();

        System.assertNotEquals(null, opp.Id);
    }

    @isTest
    static void testClosedWonValidFinanceDeal() {
        Opportunity opp = new Opportunity(
            Name = 'Valid Finance Deal',
            StageName = 'Closed Won',
            CloseDate = Date.today(),
            Amount = 20000,
            Vehicle__c = getVehicleId(),
            Deal_Type__c = 'Finance',
            Insurance_Verified__c = true
        );

        Test.startTest();
        insert opp;
        Test.stopTest();

        System.assertNotEquals(null, opp.Id);
    }

    @isTest
    static void testClosedWonMissingVehicleFails() {
        Opportunity opp = new Opportunity(
            Name = 'Missing Vehicle',
            StageName = 'Closed Won',
            CloseDate = Date.today(),
            Amount = 15000,
            Deal_Type__c = 'Cash',
            Insurance_Verified__c = false
        );

        Test.startTest();
        try {
            insert opp;
            System.assert(false, 'Expected DmlException was not thrown');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('Vehicle must be selected'));
        }
        Test.stopTest();
    }

    @isTest
    static void testClosedWonAmountFails() {
        Opportunity opp = new Opportunity(
            Name = 'Invalid Amount',
            StageName = 'Closed Won',
            CloseDate = Date.today(),
            Amount = 0,
            Vehicle__c = getVehicleId(),
            Deal_Type__c = 'Cash',
            Insurance_Verified__c = false
        );

        Test.startTest();
        try {
            insert opp;
            System.assert(false, 'Expected DmlException was not thrown');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('Amount must be greater than 0'));
        }
        Test.stopTest();
    }

    @isTest
    static void testClosedWonFinanceWithoutInsuranceFails() {
        Opportunity opp = new Opportunity(
            Name = 'Finance Without Insurance',
            StageName = 'Closed Won',
            CloseDate = Date.today(),
            Amount = 22000,
            Vehicle__c = getVehicleId(),
            Deal_Type__c = 'Finance',
            Insurance_Verified__c = false
        );

        Test.startTest();
        try {
            insert opp;
            System.assert(false, 'Expected DmlException was not thrown');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('Insurance must be verified for finance deals'));
        }
        Test.stopTest();
    }

    @isTest
    static void testClosedWonConsolidatedErrorMessage() {
        Opportunity opp = new Opportunity(
            Name = 'Multiple Errors',
            StageName = 'Closed Won',
            CloseDate = Date.today(),
            Amount = 0,
            Deal_Type__c = 'Finance',
            Insurance_Verified__c = false
        );

        Test.startTest();
        try {
            insert opp;
            System.assert(false, 'Expected DmlException was not thrown');
        } catch (DmlException e) {
            String msg = e.getMessage();
            System.assert(msg.contains('Vehicle must be selected'));
            System.assert(msg.contains('Amount must be greater than 0'));
            System.assert(msg.contains('Insurance must be verified for finance deals'));
        }
        Test.stopTest();
    }

    @isTest
    static void testBulkClosedWonValidation() {
        Id vehicleId = getVehicleId();
        List<Opportunity> opps = new List<Opportunity>();

        for (Integer i = 0; i < 200; i++) {
            opps.add(new Opportunity(
                Name = 'Bulk Closed Won ' + i,
                StageName = 'Closed Won',
                CloseDate = Date.today(),
                Amount = 10000 + i,
                Vehicle__c = vehicleId,
                Deal_Type__c = 'Cash',
                Insurance_Verified__c = false
            ));
        }

        Test.startTest();
        insert opps;
        Test.stopTest();

        Integer oppCount = [SELECT COUNT() FROM Opportunity WHERE Name LIKE 'Bulk Closed Won %'];
        System.assertEquals(200, oppCount);
    }
}