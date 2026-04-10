public class AuditLogService {
    private static List<Audit_Log__c> pendingLogs = new List<Audit_Log__c>();

    public static void log(String objectName, String recordId, String action,
                           String oldValue, String newValue, String severity) {
        pendingLogs.add(new Audit_Log__c(
            Object_Name__c = objectName,
            Record_Id__c   = recordId,
            Action__c      = action,
            Old_Value__c   = oldValue,
            New_Value__c   = newValue,
            Severity__c    = severity,
            Timestamp__c   = System.now()
        ));
    }

    public static void commitLogs() {
        if (pendingLogs.isEmpty()) return;
        try {
            insert pendingLogs;
        } catch (Exception e) {
            System.debug('AuditLogService insert failed: ' + e.getMessage());
        } finally {
            pendingLogs.clear();
        }
    }
}
