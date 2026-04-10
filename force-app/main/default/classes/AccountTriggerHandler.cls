public with sharing class AccountTriggerHandler {

    public static void beforeInsert(List<Account> newAccounts) {
        // Add your logic here
        for(Account acc : newAccounts) {
            // Example: Set default values
            if(acc.Type == null) {
                acc.Type = 'Prospect';
            }
        }
    }

    public static void beforeUpdate(List<Account> newAccounts, Map<Id, Account> oldMap) {
        // Add your logic here
        for(Account acc : newAccounts) {
            Account oldAcc = oldMap.get(acc.Id);
            // Example: Track changes
        }
    }

    public static void afterInsert(List<Account> newAccounts) {
        // Add your logic here
    }

    public static void afterUpdate(List<Account> newAccounts, Map<Id, Account> oldMap) {
        // Add your logic here
    }

    public static void beforeDelete(List<Account> oldAccounts) {
        // Add your logic here
    }

    public static void afterDelete(List<Account> oldAccounts) {
        // Add your logic here
    }

    public static void afterUndelete(List<Account> newAccounts) {
        // Add your logic here
    }
}