public class UserInfoDetails {
@AuraEnabled(cacheable=true)
    public static Profile getUserDetails() {
        Profile p = [select id, Name from Profile where id=:Userinfo.getProfileid()];
        return p;
    }
}