package it.back.back_app.domain.member.dto;

import it.back.back_app.domain.user.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminMemberUpdateRequest {
    private User.Role role;
    private User.Status status;
    private String username;  
    private String password;  
    private String name;      
    private String phone;
}
