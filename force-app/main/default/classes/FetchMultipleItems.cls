public class FetchMultipleItems {
    @AuraEnabled(Cacheable=true)
    public static List<Checklist2__c> search() {
	return [SELECT Id FROM Checklist2__c LIMIT 10];        
    }
}