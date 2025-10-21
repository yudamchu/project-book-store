package it.back.back_app.domain.member.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberUpdateRequest {
    private String username;  
    private String password;  
    private String name;      
    private String phone;
}
