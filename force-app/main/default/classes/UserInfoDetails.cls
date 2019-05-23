public class UserInfoDetails {
@AuraEnabled(cacheable=true)
    public static Profile getUserDetails() {
        Profile p = [select id, Name from Profile where id=:Userinfo.getProfileid()];
        return p;
    }

@AuraEnabled(cacheable=true)
    public static User getUserId() {
        User user = [select id, Name from User where id=:UserInfo.getUserId()];
        return user;
    }
}