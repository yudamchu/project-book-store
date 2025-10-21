package it.back.back_app.security;

import it.back.back_app.domain.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() { return user.getPassword(); }

    @Override
    public String getUsername() { return user.getUsername(); }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return user.getStatus() == User.Status.ACTIVE; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return user.getStatus() == User.Status.ACTIVE; }

    public User getUser() { return user; }

    //로그인한 사용자의 userId를 바로 가져올 수 있게 추가 
    public Long getUserId() {
        return user.getUserId();
    }

    //(선택) 필요시 name, role 등도 쉽게 접근 가능하게 추가 가능 
    public String getName() {
        return user.getName();
    }

    public String getRole() {
        return user.getRole().name();
    }
}
