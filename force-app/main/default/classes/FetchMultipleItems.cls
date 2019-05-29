public class FetchMultipleItems {
    // This class is used to get the list of Record Id's
    @AuraEnabled(Cacheable=true)
    public static List<Checklist2__c> search() {
	return [SELECT Id, Owner.Username FROM Checklist2__c LIMIT 10];        
    }
}