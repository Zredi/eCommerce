package com.agro.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.agro.model.User;
import com.agro.model.enums.Role;

import java.util.Collection;
import java.util.Collections;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AppUserDetails implements UserDetails {
       private Long id;
       private String email;
       private String password;
       private Role role;

       public static AppUserDetails buildUserDetails(User user) {

           return new AppUserDetails(
                   user.getId(),
                   user.getEmail(),
                   user.getPassword(),
                   user.getRole());
       }

       @Override
       public Collection<? extends GrantedAuthority> getAuthorities() {
           return Collections.singleton(new SimpleGrantedAuthority(role.toString()));
       }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

}
