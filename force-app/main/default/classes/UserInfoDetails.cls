public class UserInfoDetails {
    // This class is used to get profile id of the user.
@AuraEnabled(cacheable=true)
    public static Profile getUserDetails() {
        Profile p = [select id, Name from Profile where id=:Userinfo.getProfileid()];
        return p;
    }
 // This class is used to get user id of the user.
@AuraEnabled(cacheable=true)
    public static User getUserId() {
        User user = [select id, Name from User where id=:UserInfo.getUserId()];
        return user;
    }
}