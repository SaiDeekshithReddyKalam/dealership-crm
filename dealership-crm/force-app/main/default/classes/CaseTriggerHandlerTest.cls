@IsTest
public class CaseTriggerHandlerTest {

    @IsTest
    static void overwritesDateWhenMovedToWorkingAgain() {
      
        Case c = new Case(Subject = 'Test', Status = 'New');
        insert c;

      
        c.Status = 'Working';
        update c;

       
        c.Status = 'New';
        c.Date_Work_Started__c = System.now().addDays(-5);
        update c;

        Datetime forcedOldValue = [
            SELECT Date_Work_Started__c
            FROM Case
            WHERE Id = :c.Id
        ].Date_Work_Started__c;

        c.Status = 'Working';
        update c;

        Datetime newValue = [
            SELECT Date_Work_Started__c
            FROM Case
            WHERE Id = :c.Id
        ].Date_Work_Started__c;

        System.assertNotEquals(null, newValue, 'Date should not be null after moving to Working.');
        System.assertNotEquals(forcedOldValue, newValue, 'Date should be overwritten when moved to Working again.');
    }
}